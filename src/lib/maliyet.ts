import { Car } from "@/data/cars";

export const MALIYET_VARSAYIMLARI = {
  benzinLitreFiyati: 43.5, // TL / Litre
  dizelLitreFiyati: 44.2, // TL / Litre
  elektrikKwhFiyati: 4.8, // TL / kWh (Ev tipi AC ve halka açık karma ortalama)
  varsayilanYillikKm: 15000,
  aciklama:
    "Hesaplamalarda kullanılan yakıt ve elektrik birim fiyatları 2024 yılı ortalama Türkiye piyasası varsayımlarıdır. Bakım ve sigorta/kasko masrafları segment ve araç değerine göre tahmini modelleme ile türetilmiştir.",
};

export interface MaliyetSonucu {
  yillikKm: number;
  yakitTuketimBirimi: string;
  yakitBirimFiyati: number;
  yillikTuketimMiktari: number;
  yakitMaliyeti: number;
  bakimMaliyeti: number;
  sigortaMaliyeti: number;
  toplamYillikMaliyet: number;
  aylikOrtalamaMaliyet: number;
  kmBasiMaliyet: number;
}

/**
 * Türk Lirası para birimi biçimlendirici
 * Örn: 1.250.000 ₺
 */
export function formatPrice(amount: number): string {
  return (
    new Intl.NumberFormat("tr-TR", {
      maximumFractionDigits: 0,
    }).format(Math.round(amount)) + " ₺"
  );
}

/**
 * Saf maliyet hesaplama fonksiyonu
 */
export function hesaplaYillikMaliyet(
  car: Car,
  yillikKm: number = MALIYET_VARSAYIMLARI.varsayilanYillikKm
): MaliyetSonucu {
  const km = Math.max(1000, yillikKm);

  // 1. Yakıt / Enerji Maliyeti
  let yakitBirimFiyati = MALIYET_VARSAYIMLARI.benzinLitreFiyati;
  let yakitTuketimBirimi = "L/100km";

  if (car.yakit === "elektrik") {
    yakitBirimFiyati = MALIYET_VARSAYIMLARI.elektrikKwhFiyati;
    yakitTuketimBirimi = "kWh/100km";
  } else if (car.yakit === "dizel") {
    yakitBirimFiyati = MALIYET_VARSAYIMLARI.dizelLitreFiyati;
  } else {
    yakitBirimFiyati = MALIYET_VARSAYIMLARI.benzinLitreFiyati;
  }

  // Tüketilen toplam litre veya kWh
  const yillikTuketimMiktari = (km / 100) * car.ortalamaTuketim;
  const yakitMaliyeti = yillikTuketimMiktari * yakitBirimFiyati;

  // 2. Tahmini Yıllık Periyodik Bakım Maliyeti
  // Elektrikli araçlarda motor yağı, triger, buji vb. olmadığı için bakım gideri daha düşüktür.
  let bazBakim = 16000;
  if (car.yakit === "elektrik") {
    bazBakim = 8500;
  } else if (car.kasaTipi === "pickup" || car.kasaTipi === "suv") {
    bazBakim = 21000;
  } else if (car.yakit === "dizel") {
    bazBakim = 19000;
  }

  // Kilometreye bağlı oransal aşınma düzeltmesi (15.000 km referanslı)
  const bakimMaliyeti = bazBakim * (0.6 + 0.4 * (km / 15000));

  // 3. Tahmini Kasko ve Zorunlu Trafik Sigortası Maliyeti
  // Araç tahmini piyasa ortalama değerinin yaklaşık %2.0 - %2.3'ü
  const ortalamaDeger = (car.fiyatMin + car.fiyatMax) / 2;
  const sigortaMaliyeti = Math.max(16000, Math.min(65000, ortalamaDeger * 0.021));

  // Toplamlar
  const toplamYillikMaliyet = yakitMaliyeti + bakimMaliyeti + sigortaMaliyeti;
  const aylikOrtalamaMaliyet = toplamYillikMaliyet / 12;
  const kmBasiMaliyet = toplamYillikMaliyet / km;

  return {
    yillikKm: km,
    yakitTuketimBirimi,
    yakitBirimFiyati,
    yillikTuketimMiktari,
    yakitMaliyeti,
    bakimMaliyeti,
    sigortaMaliyeti,
    toplamYillikMaliyet,
    aylikOrtalamaMaliyet,
    kmBasiMaliyet,
  };
}
