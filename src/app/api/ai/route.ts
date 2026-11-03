import { NextRequest, NextResponse } from "next/server";
import { carsData } from "@/data/cars";
import { yerelAracOnerisi, yerelBakimPlani, type OneriGirdisi, type BakimGirdisi } from "@/lib/yerelOneri";

type Neden = "anahtar-yok" | "zaman-asimi" | "api-hatasi" | "bos-cevap" | "gecersiz-cevap";
type GeminiSonuc = { ok: true; data: unknown } | { ok: false; neden: Neden };
const fail = (status: number, error: string) => NextResponse.json({ error }, { status });
const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

async function gemini(prompt: string, apiKey: string, model: string): Promise<GeminiSonuc> {
  let activeModel = model;
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent`, {
        method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } }),
        signal: controller.signal,
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        const message = payload?.error?.message ?? "Gemini API yanıt vermedi";
        console.error(`[Gemini] HTTP ${res.status}: ${message}`);
        if (res.status === 404 && activeModel !== "gemini-3.8-flash") { activeModel = "gemini-3.8-flash"; continue; }
        if (attempt === 0 && (res.status === 429 || res.status >= 500)) { await new Promise((r) => setTimeout(r, 350)); continue; }
        return { ok: false, neden: "api-hatasi" };
      }
      const text = payload?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("").trim();
      if (!text) { console.error("[Gemini] HTTP 200: Boş metin yanıtı"); return { ok: false, neden: "bos-cevap" }; }
      try { return { ok: true, data: JSON.parse(text) }; }
      catch { console.error("[Gemini] HTTP 200: Yanıt JSON olarak ayrıştırılamadı"); return { ok: false, neden: "gecersiz-cevap" }; }
    } catch (error) {
      const timeoutHappened = controller.signal.aborted;
      console.error(`[Gemini] HTTP yok: ${error instanceof Error ? error.message : "Bilinmeyen ağ hatası"}`);
      return { ok: false, neden: timeoutHappened ? "zaman-asimi" : "api-hatasi" };
    } finally { clearTimeout(timeout); }
  }
  return { ok: false, neden: "api-hatasi" };
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { const parsed: unknown = await req.json(); if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fail(400, "İstek gövdesi JSON nesnesi olmalıdır."); body = parsed as Record<string, unknown>; }
  catch { return fail(400, "Geçersiz JSON isteği."); }
  const mod = body.mod;
  if (mod !== "oneri" && mod !== "bakim") return fail(400, "Mod 'oneri' veya 'bakim' olmalıdır.");
  const key = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";
  let veri: OneriGirdisi | BakimGirdisi;
  let prompt: string;
  if (mod === "oneri") {
    const aile = ["yalniz", "cift", "cocuklu-aile", "kalabalik-aile"];
    const priorities = ["yakit-ekonomisi", "guvenlik", "performans", "konfor"];
    if (!isNumber(body.butce) || body.butce < 100000 || body.butce > 100000000) return fail(400, "Bütçe 100.000–100.000.000 TL arasında olmalıdır.");
    if (!isNumber(body.gunlukKm) || body.gunlukKm < 0 || body.gunlukKm > 2000) return fail(400, "Günlük kilometre 0–2.000 arasında olmalıdır.");
    if (!aile.includes(String(body.aileDurumu))) return fail(400, "Aile durumu geçersiz.");
    if (!Array.isArray(body.oncelikler) || body.oncelikler.length > 4 || body.oncelikler.some((x) => typeof x !== "string" || !priorities.includes(x))) return fail(400, "Öncelik seçimleri geçersiz.");
    if (typeof body.not !== "string" || body.not.length > 500) return fail(400, "Ek not en fazla 500 karakter olabilir.");
    veri = { butce: body.butce, gunlukKm: body.gunlukKm, aileDurumu: body.aileDurumu as OneriGirdisi["aileDurumu"], oncelikler: body.oncelikler as string[], not: body.not };
    prompt = `Türkçe yanıt ver. Bu listedeki araçlardan en uygun 3 tanesini seç ve sadece JSON döndür: {"onerilenAraclar":[{"id":"araç id","marka":"marka","model":"model","gerekce":"Türkçe gerekçe"}],"genelTavsiye":"Türkçe tavsiye"}. Liste: ${JSON.stringify(carsData.map(({id,marka,model,fiyatMin,fiyatMax,yakit,etiketler})=>({id,marka,model,fiyatMin,fiyatMax,yakit,etiketler})))} Profil: ${JSON.stringify(veri)}`;
  } else {
    if (typeof body.aracModeli !== "string" || !body.aracModeli.trim() || body.aracModeli.length > 100) return fail(400, "Araç modeli 1–100 karakter olmalıdır.");
    if (!isNumber(body.km) || body.km < 0 || body.km > 2000000) return fail(400, "Kilometre 0–2.000.000 arasında olmalıdır.");
    if (!isNumber(body.aracYasi) || body.aracYasi < 0 || body.aracYasi > 100) return fail(400, "Araç yaşı 0–100 arasında olmalıdır.");
    if (!["benzin", "dizel", "hibrit", "elektrik"].includes(String(body.yakitTuru))) return fail(400, "Yakıt türü geçersiz.");
    veri = { aracModeli: body.aracModeli.trim(), km: body.km, aracYasi: body.aracYasi, yakitTuru: body.yakitTuru as BakimGirdisi["yakitTuru"] };
    prompt = `Türkçe, araç bakım planı JSON'u döndür: {"aracBilgisi":"...","kalemler":[{"kalem":"...","onerilenZamanKm":"...","tahminiMasraf":"...","onemDerecesi":"yuksek|orta|dusuk","aciklama":"..."}],"tavsiyeler":["..."]}. Araç: ${JSON.stringify(veri)}`;
  }
  const local = () => mod === "oneri" ? yerelAracOnerisi(veri as OneriGirdisi) : yerelBakimPlani(veri as BakimGirdisi);
  if (!key) return NextResponse.json({ kaynak: "yerel", veri: local(), neden: "anahtar-yok", not: "AI anahtarı yapılandırılmadı; yerel öneri sistemi kullanıldı." });
  const result = await gemini(prompt, key, model);
  if (!result.ok) {
    const notes: Record<Neden, string> = {
      "anahtar-yok": "AI anahtarı yapılandırılmadı; yerel öneri sistemi kullanıldı.",
      "zaman-asimi": "AI servisi zamanında yanıt vermedi, yerel öneri sistemi kullanıldı.",
      "api-hatasi": "AI servisine şu anda ulaşılamıyor, yerel öneri sistemi kullanıldı.",
      "bos-cevap": "AI servisi boş yanıt verdi, yerel öneri sistemi kullanıldı.",
      "gecersiz-cevap": "AI yanıtı doğrulanamadı, yerel öneri sistemi kullanıldı.",
    };
    return NextResponse.json({ kaynak: "yerel", veri: local(), neden: result.neden, not: notes[result.neden] });
  }
  if (mod === "oneri") {
    const data = result.data as { onerilenAraclar?: unknown; genelTavsiye?: unknown };
    const list = data?.onerilenAraclar;
    if (!Array.isArray(list) || list.length < 1 || list.some((item) => !item || typeof item !== "object" || !carsData.some((car) => car.id === (item as {id?: string}).id)))
      return NextResponse.json({ kaynak: "yerel", veri: local(), neden: "gecersiz-cevap", not: "AI yanıtındaki araçlar doğrulanamadı, yerel öneri sistemi kullanıldı." });
  } else {
    const data = result.data as { aracBilgisi?: unknown; kalemler?: unknown; tavsiyeler?: unknown };
    if (typeof data?.aracBilgisi !== "string" || !Array.isArray(data.kalemler) || !Array.isArray(data.tavsiyeler)) return NextResponse.json({ kaynak: "yerel", veri: local(), neden: "gecersiz-cevap", not: "AI yanıtı doğrulanamadı, yerel bakım planı kullanıldı." });
  }
  return NextResponse.json({ kaynak: "gemini", veri: result.data });
}
