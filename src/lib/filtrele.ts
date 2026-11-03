import type { Car } from "@/data/cars";

export type AracSiralama = "onerilen" | "fiyat-artan" | "fiyat-azalan" | "motor-gucu" | "tuketim";

export interface AracFiltreleri {
  arama: string;
  markalar: string[];
  kasaTipleri: Car["kasaTipi"][];
  yakitTipleri: Car["yakit"][];
  vitesTipleri: Car["vites"][];
  fiyatMin: number;
  fiyatMax: number;
  siralama: AracSiralama;
}

export function filtreleAraclar(araclar: Car[], filtreler: AracFiltreleri): Car[] {
  const arama = filtreler.arama.trim().toLocaleLowerCase("tr-TR");
  const sonuc = araclar.filter((arac) => {
    if (arama && !`${arac.marka} ${arac.model}`.toLocaleLowerCase("tr-TR").includes(arama)) return false;
    if (filtreler.markalar.length && !filtreler.markalar.includes(arac.marka)) return false;
    if (filtreler.kasaTipleri.length && !filtreler.kasaTipleri.includes(arac.kasaTipi)) return false;
    if (filtreler.yakitTipleri.length && !filtreler.yakitTipleri.includes(arac.yakit)) return false;
    if (filtreler.vitesTipleri.length && !filtreler.vitesTipleri.includes(arac.vites)) return false;
    if (arac.fiyatMax < filtreler.fiyatMin || arac.fiyatMin > filtreler.fiyatMax) return false;
    return true;
  });

  switch (filtreler.siralama) {
    case "fiyat-artan": return sonuc.sort((a, b) => a.fiyatMin - b.fiyatMin);
    case "fiyat-azalan": return sonuc.sort((a, b) => b.fiyatMax - a.fiyatMax);
    case "motor-gucu": return sonuc.sort((a, b) => b.motorGucuHp - a.motorGucuHp);
    case "tuketim": return sonuc.sort((a, b) => a.ortalamaTuketim - b.ortalamaTuketim);
    default: return sonuc;
  }
}
