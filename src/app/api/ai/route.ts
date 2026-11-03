import { NextRequest, NextResponse } from "next/server";
import { carsData } from "@/data/cars";
import {
  yerelAracOnerisi,
  yerelBakimPlani,
  OneriGirdisi,
  BakimGirdisi,
} from "@/lib/yerelOneri";

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Geçersiz istek gövdesi. JSON formatı bekleniyor." },
        { status: 400 }
      );
    }

    const mod = body?.mod;

    if (mod !== "oneri" && mod !== "bakim") {
      return NextResponse.json(
        { error: "Geçersiz mod parametresi. 'oneri' veya 'bakim' olmalıdır." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    // Google Gemini standart modeli gemini-1.5-flash
    const model = process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";

    // 1. ÖNERİ MODU
    if (mod === "oneri") {
      const oneriGirdisi: OneriGirdisi = {
        butce: Number(body.butce) || 1800000,
        gunlukKm: Number(body.gunlukKm) || 40,
        aileDurumu: (body.aileDurumu as OneriGirdisi["aileDurumu"]) || "cocuklu-aile",
        oncelikler: Array.isArray(body.oncelikler) ? (body.oncelikler as string[]) : [],
        not: typeof body.not === "string" ? body.not : "",
      };

      // API anahtarı yoksa doğrudan kural tabanlı yerel motora geç
      if (!apiKey) {
        const yerelSonuc = yerelAracOnerisi(oneriGirdisi);
        return NextResponse.json({
          kaynak: "yerel",
          veri: yerelSonuc,
          not: "Gemini API anahtarı yapılandırılmadığı için yerel öneri motoru kullanıldı.",
        });
      }

      // Gemini için araç referans havuzu
      const aracHavuzu = carsData.map((c) => ({
        id: c.id,
        marka: c.marka,
        model: c.model,
        kasaTipi: c.kasaTipi,
        yakit: c.yakit,
        fiyatMin: c.fiyatMin,
        fiyatMax: c.fiyatMax,
        motorGucuHp: c.motorGucuHp,
        ortalamaTuketim: c.ortalamaTuketim,
        menzilKm: c.menzilKm,
        bagajLitre: c.bagajLitre,
        koltukSayisi: c.koltukSayisi,
        guvenlikPuani: c.guvenlikPuani,
        etiketler: c.etiketler,
      }));

      const systemPrompt = `Sen Türkiye otomotiv pazarında uzman, tarafsız bir araç danışmanısın.
Kullanıcının bütçesi, günlük km'si, aile durumu ve önceliklerine göre aşağıdaki ARAÇ LİSTESİNDEN tam olarak en uygun 3 aracı seç.
KESİNLİKLE LİSTEDE OLMAYAN BİR ARAÇ VEYA ID SEÇME. Sadece verilen listedeki "id" değerlerini kullan.

Kullanıcı Profili:
- Bütçe: ${oneriGirdisi.butce.toLocaleString("tr-TR")} TL
- Günlük Ortalama Yol: ${oneriGirdisi.gunlukKm} km
- Aile / Kullanıcı Durumu: ${oneriGirdisi.aileDurumu}
- Öncelikler: ${oneriGirdisi.oncelikler.join(", ") || "Dengeli kullanım"}
- Ek Kullanıcı Notu: ${oneriGirdisi.not || "Yok"}

ARAÇ LİSTESİ (SADECE BU LİSTEDEN SEÇ):
${JSON.stringify(aracHavuzu)}

Çıktı Formatı: Yalnızca aşağıdaki JSON şemasına uygun geçerli JSON döndür:
{
  "onerilenAraclar": [
    {
      "id": "<listedeki birebir id>",
      "marka": "<marka>",
      "model": "<model>",
      "gerekce": "<Kullanıcının bütçesine, km'sine ve önceliklerine neden uyduğunu anlatan 1-2 cümlelik Türkçe gerekçe>"
    }
  ],
  "genelTavsiye": "<Kullanıcının bütçesini ve sürüş tarzını göz önünde bulunduran 1-2 cümlelik genel değerlendirme ve tavsiye>"
}`;

      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

        // 8 saniyelik zaman aşımı (Google API gecikirse hemen yerel motora düşer)
        const res = await fetch(geminiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (!res.ok) {
          throw new Error(`Gemini API HTTP ${res.status}`);
        }

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          throw new Error("Gemini yanıtından metin alınamadı.");
        }

        const parsed = JSON.parse(rawText);

        // ID doğrulaması: Dönen id'lerin gerçekten carsData içinde var olduğunu denetle
        const gecerliAraclar = (parsed.onerilenAraclar || []).filter(
          (item: { id: string }) => carsData.some((c) => c.id === item.id)
        );

        if (gecerliAraclar.length === 0) {
          throw new Error("Gemini geçerli bir araç id'si döndüremedi.");
        }

        // Eğer 3'ten az geçerli araç döndüyse, yerel sistemden tamamla
        if (gecerliAraclar.length < 3) {
          const yerelYedek = yerelAracOnerisi(oneriGirdisi);
          for (const yedek of yerelYedek.onerilenAraclar) {
            if (!gecerliAraclar.some((g: { id: string }) => g.id === yedek.id)) {
              gecerliAraclar.push(yedek);
              if (gecerliAraclar.length === 3) break;
            }
          }
        }

        return NextResponse.json({
          kaynak: "gemini",
          veri: {
            onerilenAraclar: gecerliAraclar.slice(0, 3),
            genelTavsiye: parsed.genelTavsiye || "İhtiyaçlarınıza uygun modeller listelenmiştir.",
          },
        });
      } catch {
        // Hata veya zaman aşımı durumunda güvenli yerel yedek sisteme geç
        const yerelSonuc = yerelAracOnerisi(oneriGirdisi);
        return NextResponse.json({
          kaynak: "yerel",
          veri: yerelSonuc,
          not: "Yapay zekâ servisine erişilemediği için yerel öneri motoru devreye alındı.",
        });
      }
    }

    // 2. BAKIM MODU
    if (mod === "bakim") {
      const bakimGirdisi: BakimGirdisi = {
        aracModeli: String(body.aracModeli || "Binek Araç").trim(),
        km: Math.max(0, Number(body.km) || 45000),
        aracYasi: Math.max(0, Number(body.aracYasi) || 3),
        yakitTuru: (body.yakitTuru as BakimGirdisi["yakitTuru"]) || "benzin",
      };

      if (!apiKey) {
        const yerelSonuc = yerelBakimPlani(bakimGirdisi);
        return NextResponse.json({
          kaynak: "yerel",
          veri: yerelSonuc,
          not: "Gemini API anahtarı yapılandırılmadığı için yerel bakım rehberi kullanıldı.",
        });
      }

      const systemPrompt = `Sen profesyonel bir otomotiv servis başteknisyenisin.
Aşağıda bilgileri verilen araç için mevcut kilometre ve yaşına göre yaklaşan en kritik periyodik bakım kalemlerini ve tahmini Türkiye piyasası masraf aralıklarını (TL) içeren bir bakım planı oluştur.

Araç Bilgisi:
- Model: ${bakimGirdisi.aracModeli}
- Güncel Kilometre: ${bakimGirdisi.km.toLocaleString("tr-TR")} km
- Araç Yaşı: ${bakimGirdisi.aracYasi} yıl
- Yakıt Türü: ${bakimGirdisi.yakitTuru}

Çıktı Formatı: Yalnızca aşağıdaki JSON şemasına uygun geçerli JSON döndür:
{
  "aracBilgisi": "${bakimGirdisi.aracModeli} (${bakimGirdisi.km.toLocaleString("tr-TR")} km, ${bakimGirdisi.aracYasi} Yaşında, ${bakimGirdisi.yakitTuru.toUpperCase()})",
  "kalemler": [
    {
      "kalem": "<Bakım parçası veya işlemi, örn: Motor Yağı ve Yağ Filtresi>",
      "onerilenZamanKm": "<Zaman veya km aralığı, örn: Gelecek 2.000 km içinde veya 3 ayda>",
      "tahminiMasraf": "<TL tahmini aralığı, örn: 3.500 ₺ - 5.500 ₺>",
      "onemDerecesi": "yuksek" | "orta" | "dusuk",
      "aciklama": "<İşlemin neden gerekli olduğu hakkında kısa teknik açıklama>"
    }
  ],
  "tavsiyeler": [
    "<Sürücüye aracının sağlığını koruması için 1-2 cümlelik pratik tavsiye>",
    "<Bir diğer kısa pratik tavsiye>"
  ]
}`;

      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

        const res = await fetch(geminiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (!res.ok) {
          throw new Error(`Gemini API HTTP ${res.status}`);
        }

        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          throw new Error("Gemini yanıtından metin alınamadı.");
        }

        const parsed = JSON.parse(rawText);

        return NextResponse.json({
          kaynak: "gemini",
          veri: parsed,
        });
      } catch {
        const yerelSonuc = yerelBakimPlani(bakimGirdisi);
        return NextResponse.json({
          kaynak: "yerel",
          veri: yerelSonuc,
          not: "Yapay zekâ servisine erişilemediği için yerel bakım motoru devreye alındı.",
        });
      }
    }

    return NextResponse.json({ error: "İşlem tamamlanamadı." }, { status: 400 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Sunucu hatası oluştu.";
    return NextResponse.json(
      { error: "İstek işlenirken hata oluştu: " + errorMsg },
      { status: 500 }
    );
  }
}
