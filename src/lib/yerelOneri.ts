import { carsData } from "@/data/cars";

export interface OneriGirdisi {
  butce: number; // TL
  gunlukKm: number;
  aileDurumu: "yalniz" | "cift" | "cocuklu-aile" | "kalabalik-aile";
  oncelikler: string[]; // "yakit-ekonomisi", "guvenlik", "performans", "konfor"
  not?: string;
}

export interface OneriAracSonucu {
  id: string;
  marka: string;
  model: string;
  gerekce: string;
}

export interface OneriCiktisi {
  onerilenAraclar: OneriAracSonucu[];
  genelTavsiye: string;
}

export interface BakimGirdisi {
  aracModeli: string;
  km: number;
  aracYasi: number;
  yakitTuru: "benzin" | "dizel" | "hibrit" | "elektrik";
}

export interface BakimKalemi {
  kalem: string;
  onerilenZamanKm: string;
  tahminiMasraf: string;
  onemDerecesi: "yuksek" | "orta" | "dusuk";
  aciklama: string;
}

export interface BakimCiktisi {
  aracBilgisi: string;
  kalemler: BakimKalemi[];
  tavsiyeler: string[];
}

/**
 * Kural tabanlı yerel araç öneri algoritması
 */
export function yerelAracOnerisi(girdi: OneriGirdisi): OneriCiktisi {
  const { butce, gunlukKm, aileDurumu, oncelikler } = girdi;

  const scoredCars = carsData.map((car) => {
    let score = 100;

    // 1. Bütçe puanlaması
    const ortalamaFiyat = (car.fiyatMin + car.fiyatMax) / 2;
    if (ortalamaFiyat <= butce) {
      // Bütçenin altında ve bütçeye yakınsa yüksek puan
      const oran = ortalamaFiyat / butce;
      score += Math.round(oran * 40);
    } else if (car.fiyatMin <= butce * 1.1) {
      // Bütçeyi azıcık aşıyorsa küçük tolerans
      score += 15;
    } else {
      // Bütçeyi çok aşıyorsa ciddi ceza puanı
      const asim = (car.fiyatMin - butce) / butce;
      score -= Math.round(asim * 100);
    }

    // 2. Günlük Kilometre ve Yakıt Verimliliği
    if (gunlukKm >= 50) {
      if (car.yakit === "elektrik" || car.yakit === "hibrit") score += 35;
      if (car.yakit === "dizel") score += 25;
      if (car.ortalamaTuketim <= 5.0) score += 20;
    } else if (gunlukKm <= 20) {
      if (car.kasaTipi === "hatchback" || car.kasaTipi === "sedan") score += 15;
    }

    // 3. Aile Durumu & Alan İhtiyacı
    if (aileDurumu === "kalabalik-aile") {
      if (car.koltukSayisi >= 5 && car.bagajLitre >= 500) score += 35;
      if (car.kasaTipi === "suv" || car.kasaTipi === "station-wagon") score += 20;
      if (car.bagajLitre < 400) score -= 30;
    } else if (aileDurumu === "cocuklu-aile") {
      if (car.bagajLitre >= 440) score += 25;
      if (car.guvenlikPuani === 5) score += 25;
      if (car.kasaTipi === "suv" || car.kasaTipi === "sedan") score += 15;
    } else if (aileDurumu === "yalniz") {
      if (car.kasaTipi === "hatchback") score += 25;
      if (car.etiketler.includes("sehir-ici")) score += 20;
    } else if (aileDurumu === "cift") {
      if (car.kasaTipi === "hatchback" || car.kasaTipi === "suv") score += 15;
    }

    // 4. Öncelikler
    if (oncelikler.includes("yakit-ekonomisi")) {
      if (car.ortalamaTuketim <= 5.2 || car.yakit === "elektrik") score += 30;
      if (car.etiketler.includes("ekonomik")) score += 15;
    }

    if (oncelikler.includes("guvenlik")) {
      if (car.guvenlikPuani === 5) score += 35;
      if (car.etiketler.includes("guvenlik")) score += 15;
    }

    if (oncelikler.includes("performans")) {
      if (car.motorGucuHp >= 150) score += 25;
      if (car.motorGucuHp >= 200) score += 35;
      if (car.etiketler.includes("performans")) score += 15;
    }

    if (oncelikler.includes("konfor")) {
      if (car.etiketler.includes("konfor")) score += 25;
      if (car.kasaTipi === "sedan" || car.kasaTipi === "station-wagon") score += 15;
    }

    return { car, score };
  });

  // Puana göre sırala ve en iyi 3 aracı seç
  scoredCars.sort((a, b) => b.score - a.score);
  const top3 = scoredCars.slice(0, 3).map(({ car }) => {
    let gerekce = "";
    if (car.yakit === "elektrik") {
      gerekce = `Günde ${gunlukKm} km sürüş profiliniz için sıfır emisyonlu düşük km maliyeti, ${car.motorGucuHp} HP güç ve ${car.menzilKm || 450} km menziliyle bütçenize yüksek verimlilik sağlar.`;
    } else if (car.yakit === "hibrit") {
      gerekce = `${car.ortalamaTuketim} L/100km seviyesindeki tutumlu karma tüketimi, ${car.bagajLitre} L bagaj kapasitesi ve güvenilirliğiyle kriterlerinizle kusursuz örtüşüyor.`;
    } else {
      gerekce = `${car.motorGucuHp} HP dinamik motoru, ${car.bagajLitre} L hacmi ve bütçenize uygun piyasa fiyatıyla dengeli bir sürüş sunar.`;
    }

    return {
      id: car.id,
      marka: car.marka,
      model: car.model,
      gerekce,
    };
  });

  // Genel tavsiye cümlesi
  const oncelikAdlari: Record<string, string> = {
    "yakit-ekonomisi": "yakıt ekonomisi",
    guvenlik: "güvenlik",
    performans: "performans",
    konfor: "konfor",
  };
  const oncelikMetin = oncelikler.length > 0
    ? oncelikler.map((oncelik) => oncelikAdlari[oncelik] ?? oncelik).join(", ")
    : "genel dengeli kullanım";
  const genelTavsiye = `Belirttiğiniz ${butce.toLocaleString("tr-TR")} ₺ bütçe, günlük ${gunlukKm} km rota ve "${oncelikMetin}" beklentileriniz doğrultusunda seçilen bu 3 alternatif, toplam sahip olma ve yürütme maliyeti açısından en mantıklı modellerdir.`;

  return {
    onerilenAraclar: top3,
    genelTavsiye,
  };
}

/**
 * Kural tabanlı yerel bakım planı algoritması
 */
export function yerelBakimPlani(girdi: BakimGirdisi): BakimCiktisi {
  const { aracModeli, km, aracYasi, yakitTuru } = girdi;
  const kalemler: BakimKalemi[] = [];
  const tavsiyeler: string[] = [];

  const isElektrikli = yakitTuru === "elektrik";

  // 1. Motor Yağı & Yağ Filtresi
  if (isElektrikli) {
    kalemler.push({
      kalem: "Redüktör Yağı ve İnvertör Soğutma Sıvısı",
      onerilenZamanKm: "Yılda 1 kez veya 40.000 km",
      tahminiMasraf: "2.500 ₺ - 4.500 ₺",
      onemDerecesi: "orta",
      aciklama: "Elektrik motorunun redüktör dişli kutusu ve batarya soğutma sıvısı seviyesi ve sızdırmazlık kontrolü.",
    });
  } else {
    const yagGecikme = km % 15000 > 12000 || km % 15000 < 3000;
    kalemler.push({
      kalem: "Motor Yağı & Yağ Filtresi Değişimi",
      onerilenZamanKm: "Her 10.000 - 15.000 km veya yılda 1 kez",
      tahminiMasraf: "3.500 ₺ - 6.000 ₺",
      onemDerecesi: yagGecikme ? "yuksek" : "orta",
      aciklama: "Motor iç aşınmasını önlemek için üretici onaylı viskoziteye sahip tam sentetik yağ kullanımı zorunludur.",
    });
  }

  // 2. Hava ve Polen Filtresi
  kalemler.push({
    kalem: "Hava ve Polen (Kabin) Filtresi Seti",
    onerilenZamanKm: "Her 15.000 km veya periyodik bakımda",
    tahminiMasraf: "1.200 ₺ - 2.500 ₺",
    onemDerecesi: "orta",
    aciklama: isElektrikli
      ? "Kabin içi hava kalitesi ve klima sisteminin verimi için karbonlu polen filtresi değişimi."
      : "Motorun rahat hava alması ve yakıt tasarrufu ile kabin hava kalitesi için filtre seti yenilemesi.",
  });

  // 3. Fren Balataları & Hidrolik Sıvısı
  const frenOnem = km > 40000 ? "yuksek" : "orta";
  kalemler.push({
    kalem: "Fren Balataları, Diskler ve Fren Hidrolik Sıvısı",
    onerilenZamanKm: "Her 30.000 - 45.000 km veya 2 yılda bir",
    tahminiMasraf: "4.000 ₺ - 8.500 ₺",
    onemDerecesi: frenOnem,
    aciklama: isElektrikli
      ? "Rejeneratif frenleme sayesinde balata ömrü uzundur; ancak disk paslanması ve hidrolik nem oranı mutlaka ölçülmelidir."
      : "Fren balata kalınlığı 3mm altına inmeden değiştirilmeli, hidrolik kaynama noktası test edilmelidir.",
  });

  // 4. Akü & Elektrik Sistemi
  if (isElektrikli) {
    kalemler.push({
      kalem: "Yüksek Voltaj Batarya Sağlığı (SoH) ve 12V Akü Testi",
      onerilenZamanKm: "Yılda 1 kez yetkili servis diyagnostiği",
      tahminiMasraf: "1.500 ₺ - 3.500 ₺",
      onemDerecesi: "yuksek",
      aciklama: "Hücre voltaj dengeleri, şarj döngü sağlığı ve araç sistemlerini besleyen 12V akü durumu bilgisayarlı test edilir.",
    });
  } else {
    const akuOnem = aracYasi >= 3 ? "yuksek" : "dusuk";
    kalemler.push({
      kalem: "12V Marş Aküsü Sağlık & Şarj Testi",
      onerilenZamanKm: "3. yıldan itibaren her 6 ayda bir",
      tahminiMasraf: "2.500 ₺ - 5.000 ₺ (Gerekirse değişim)",
      onemDerecesi: akuOnem,
      aciklama: "Kış ayları öncesinde akü marş gücü (CCA) ve şarj dinamosu çıkış voltajı ölçülmelidir.",
    });
  }

  // 5. Triger Kayışı / Buji / Ağır Bakım
  if (!isElektrikli) {
    if (km >= 60000 || aracYasi >= 5) {
      kalemler.push({
        kalem: "Triger Kayışı/Zinciri ve Buji/Enjektör Kontrolü",
        onerilenZamanKm: "60.000 - 90.000 km veya 5. yıl ağır bakımında",
        tahminiMasraf: "12.000 ₺ - 22.000 ₺",
        onemDerecesi: "yuksek",
        aciklama: "Triger kopması motorun subaplarına ağır hasar verir; yaş veya kilometre sınırına gelindiğinde geciktirilmemelidir.",
      });
    }
  }

  // 6. Lastik & Rot-Balans
  kalemler.push({
    kalem: "Lastik Diş Derinliği, Rot-Balans ve Basınç Ayarı",
    onerilenZamanKm: "Her 10.000 km'de bir ön/arka rotasyonu",
    tahminiMasraf: "800 ₺ - 1.800 ₺",
    onemDerecesi: "orta",
    aciklama: "Diş derinliği 3 mm altına inen lastikler fren mesafesini uzatır. Düzensiz aşınmayı önlemek için rot ayarı kontrol edilmelidir.",
  });

  // 7. Muayene Hatırlatması
  kalemler.push({
    kalem: "TÜVTÜRK Periyodik Araç Muayenesi",
    onerilenZamanKm: aracYasi >= 3 ? "2 yılda bir (Ruhsat tarihi referanslı)" : "İlk muayene 3. yıl sonunda",
    tahminiMasraf: "1.821 ₺ (Resmi muayene harcı)",
    onemDerecesi: "yuksek",
    aciklama: "Fren testi, aydınlatma grubu, emisyon pulu ve emniyet kemerleri muayene öncesi gözden geçirilmelidir.",
  });

  // Genel Tavsiyeler
  tavsiyeler.push(
    `${aracModeli} aracınız ${km.toLocaleString("tr-TR")} km ve ${aracYasi} yaşında olduğu için öncelikli olarak sıvı seviyelerini ve fren tertibatını kontrol ettiriniz.`
  );
  if (isElektrikli) {
    tavsiyeler.push(
      "Bataryayı düzenli olarak %20-%80 aralığında tutmak, hücre ömrünü korumada en kritik etkendir."
    );
  } else {
    tavsiyeler.push(
      "Orijinal veya OEM onaylı yağ filtreleri kullanmak, turbo ve motor yataklarının ömrünü doğrudan uzatır."
    );
  }

  return {
    aracBilgisi: `${aracModeli} (${km.toLocaleString("tr-TR")} km, ${aracYasi} Yaşında, ${yakitTuru.toUpperCase()})`,
    kalemler,
    tavsiyeler,
  };
}
