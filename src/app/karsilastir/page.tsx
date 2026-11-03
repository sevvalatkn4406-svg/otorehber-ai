"use client";

import React from "react";
import Link from "next/link";
import { carsData, Car } from "@/data/cars";
import { CarIcon } from "@/components/CarIcon";
import { useCompare } from "@/lib/storage";
import { formatPrice, hesaplaYillikMaliyet } from "@/lib/maliyet";

export default function KarsilastirPage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  const selectedCars: Car[] = carsData.filter((c) => compareList.includes(c.id));

  // If no cars selected, show empty state
  if (selectedCars.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-surface border border-border shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
              />
            </svg>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
            Karşılaştırma Boş
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-heading text-main tracking-tight mb-3">
            Karşılaştırılacak Araç Seçilmedi
          </h1>
          <p className="text-muted text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
            Araçları yan yana karşılaştırmak için araç kataloğundan dilediğiniz modellerin
            üzerindeki <strong>&ldquo;+ Kıyasla&rdquo;</strong> butonuna tıklayarak en fazla 3 araç seçebilirsiniz.
          </p>
          <Link
            href="/araclar"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-colors shadow-md shadow-primary/20"
          >
            Araç Kataloğuna Git
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    );
  }

  // Pre-calculate best values if there are 2 or more cars
  const hasMultiple = selectedCars.length > 1;

  const minPrice = hasMultiple
    ? Math.min(...selectedCars.map((c) => c.fiyatMin))
    : null;

  const maxPower = hasMultiple
    ? Math.max(...selectedCars.map((c) => c.motorGucuHp))
    : null;

  const minConsumption = hasMultiple
    ? Math.min(...selectedCars.map((c) => c.ortalamaTuketim))
    : null;

  const maxBoot = hasMultiple
    ? Math.max(...selectedCars.map((c) => c.bagajLitre))
    : null;

  const maxSafety = hasMultiple
    ? Math.max(...selectedCars.map((c) => c.guvenlikPuani))
    : null;

  // Annual cost at 15.000 km
  const costsMap = new Map(
    selectedCars.map((c) => [c.id, hesaplaYillikMaliyet(c, 15000).toplamYillikMaliyet])
  );
  const minCost = hasMultiple
    ? Math.min(...Array.from(costsMap.values()))
    : null;

  const mobileRows: { label: string; cells: { value: string; best?: boolean }[] }[] = [
    { label: "Tahmini fiyat", cells: selectedCars.map((car) => ({ value: `${formatPrice(car.fiyatMin)} – ${formatPrice(car.fiyatMax)}`, best: minPrice === car.fiyatMin })) },
    { label: "Kasa tipi", cells: selectedCars.map((car) => ({ value: car.kasaTipi })) },
    { label: "Yakıt / enerji", cells: selectedCars.map((car) => ({ value: car.yakit })) },
    { label: "Şanzıman / vites", cells: selectedCars.map((car) => ({ value: car.vites })) },
    { label: "Motor gücü", cells: selectedCars.map((car) => ({ value: `${car.motorGucuHp} HP`, best: maxPower === car.motorGucuHp })) },
    { label: "Karma tüketim", cells: selectedCars.map((car) => ({ value: `${car.ortalamaTuketim} ${car.yakit === "elektrik" ? "kWh/100km" : "L/100km"}`, best: minConsumption === car.ortalamaTuketim })) },
    { label: "Elektrikli menzil", cells: selectedCars.map((car) => ({ value: car.menzilKm ? `${car.menzilKm} km` : "—" })) },
    { label: "Bagaj hacmi", cells: selectedCars.map((car) => ({ value: `${car.bagajLitre} litre`, best: maxBoot === car.bagajLitre })) },
    { label: "Koltuk sayısı", cells: selectedCars.map((car) => ({ value: `${car.koltukSayisi} kişilik` })) },
    { label: "Euro NCAP güvenlik", cells: selectedCars.map((car) => ({ value: `${"★".repeat(car.guvenlikPuani)} (${car.guvenlikPuani}/5)`, best: maxSafety === car.guvenlikPuani && car.guvenlikPuani === 5 })) },
    { label: "Yıllık masraf (15.000 km)", cells: selectedCars.map((car) => { const cost = costsMap.get(car.id) ?? 0; return { value: `${formatPrice(cost)} / yıl (yakıt + bakım + sigorta)`, best: minCost === cost }; }) },
    { label: "Öne çıkan artılar", cells: selectedCars.map((car) => ({ value: car.artilar.join(" · ") })) },
    { label: "Dikkat edilmesi gerekenler", cells: selectedCars.map((car) => ({ value: car.eksiler.join(" · ") })) },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
            Birebir Kıyaslama
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-main tracking-tight">
            Araç Karşılaştırma Paneli
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Seçili {selectedCars.length} / 3 araç. En avantajlı teknik parametreler yeşil rozet ile vurgulanmıştır.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedCars.length < 3 && (
            <Link
              href="/araclar"
              className="min-h-11 px-4 py-2 rounded-xl bg-surface-elevated hover:bg-border text-main font-semibold text-xs border border-border transition-colors"
            >
              + Yeni Araç Ekle
            </Link>
          )}

          <button
            type="button"
            onClick={clearCompare}
            className="min-h-11 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-semibold text-xs transition-colors"
          >
            Seçimi Temizle
          </button>
        </div>
      </div>

      <section className="md:hidden mb-8">
        <div className="sticky top-16 z-30 grid gap-2 bg-background/95 backdrop-blur p-2 border-b border-border" style={{ gridTemplateColumns: `repeat(${selectedCars.length}, minmax(0, 1fr))` }} aria-label="Seçili araçlar">
          {selectedCars.map((car) => <div key={car.id} className="min-w-0 rounded-xl border border-border bg-surface p-2 text-center"><span className="block text-[10px] uppercase font-bold text-primary truncate">{car.marka}</span><span className="block text-xs font-semibold text-main line-clamp-2 break-words">{car.model}</span></div>)}
        </div>
        <div className="space-y-3 pt-3">
          {mobileRows.map((row) => <article key={row.label} className="rounded-2xl border border-border bg-surface p-3 min-w-0">
            <h2 className="text-xs uppercase tracking-wide font-bold text-muted mb-2">{row.label}</h2>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${selectedCars.length}, minmax(0, 1fr))` }}>
              {row.cells.map((cell, index) => <div key={selectedCars[index].id} className={`min-w-0 rounded-xl p-2 text-xs break-words [overflow-wrap:anywhere] ${cell.best ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30 font-semibold" : "bg-surface-elevated text-main"}`}>
                <span className="block text-[10px] text-muted truncate mb-1">{selectedCars[index].marka} {selectedCars[index].model}</span>{cell.value}{cell.best && <span className="block mt-1 text-[10px]">En iyi değer</span>}
              </div>)}
            </div>
          </article>)}
        </div>
      </section>

      {/* Desktop comparison table */}
      <div className="hidden md:block overflow-x-auto rounded-3xl border border-border bg-surface shadow-sm">
        <table className="w-full min-w-[650px] border-collapse text-left text-sm">
          {/* Table Header: Car Silhouettes & Names */}
          <thead>
            <tr className="border-b border-border bg-surface-elevated/40">
              <th className="p-4 sm:p-6 w-48 min-w-[160px] text-xs uppercase font-extrabold text-muted align-top">
                Kriter / Model
              </th>
              {selectedCars.map((car) => (
                <th
                  key={car.id}
                  className="p-4 sm:p-6 min-w-[220px] align-top border-l border-border/80"
                >
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      {/* Remove Button */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] uppercase font-bold tracking-wider text-primary">
                          {car.marka}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCompare(car.id)}
                          aria-label={`${car.marka} ${car.model} karşılaştırmadan çıkar`}
                          className="min-h-11 min-w-11 text-xs text-muted hover:text-rose-500 p-1 rounded hover:bg-rose-500/10 transition-colors"
                          title="Karşılaştırmadan çıkar"
                        >
                          ✕ Çıkar
                        </button>
                      </div>

                      {/* Silhouette */}
                      <div className="h-28 flex items-center justify-center p-2 rounded-xl bg-surface-elevated mb-3">
                        <CarIcon kasaTipi={car.kasaTipi} className="w-36 h-auto" />
                      </div>

                      {/* Model title */}
                      <h2 className="text-base font-bold font-heading text-main mb-1 line-clamp-1">
                        {car.model}
                      </h2>
                      <span className="text-xs text-muted block mb-3">
                        {car.yil} Model &bull; {car.kasaTipi}
                      </span>
                    </div>

                    <Link
                      href={`/araclar/${car.id}`}
                      className="text-center block w-full py-1.5 px-3 rounded-lg bg-surface hover:bg-surface-elevated text-xs font-semibold text-main border border-border transition-colors"
                    >
                      Detay Sayfası &rarr;
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body: Specifications */}
          <tbody className="divide-y divide-border">
            {/* 1. Tahmini Fiyat */}
            <tr className="hover:bg-surface-elevated/20 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-muted text-xs uppercase tracking-wide">
                Tahmini Fiyat
              </td>
              {selectedCars.map((car) => {
                const isBest = minPrice !== null && car.fiyatMin === minPrice;
                return (
                  <td key={car.id} className="p-4 sm:p-5 border-l border-border/80">
                    <span className="font-heading font-bold text-main block">
                      {formatPrice(car.fiyatMin)} - {formatPrice(car.fiyatMax)}
                    </span>
                    {isBest && (
                      <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        En Uygun Başlangıç
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* 2. Kasa Tipi */}
            <tr className="hover:bg-surface-elevated/20 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-muted text-xs uppercase tracking-wide">
                Kasa Tipi
              </td>
              {selectedCars.map((car) => (
                <td key={car.id} className="p-4 sm:p-5 border-l border-border/80 capitalize font-medium text-main">
                  {car.kasaTipi}
                </td>
              ))}
            </tr>

            {/* 3. Yakıt Cinsi */}
            <tr className="hover:bg-surface-elevated/20 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-muted text-xs uppercase tracking-wide">
                Yakıt / Enerji
              </td>
              {selectedCars.map((car) => (
                <td key={car.id} className="p-4 sm:p-5 border-l border-border/80 capitalize font-medium text-main">
                  {car.yakit}
                </td>
              ))}
            </tr>

            {/* 4. Şanzıman */}
            <tr className="hover:bg-surface-elevated/20 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-muted text-xs uppercase tracking-wide">
                Şanzıman / Vites
              </td>
              {selectedCars.map((car) => (
                <td key={car.id} className="p-4 sm:p-5 border-l border-border/80 capitalize font-medium text-main">
                  {car.vites}
                </td>
              ))}
            </tr>

            {/* 5. Motor Gücü (HP) */}
            <tr className="hover:bg-surface-elevated/20 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-muted text-xs uppercase tracking-wide">
                Motor Gücü
              </td>
              {selectedCars.map((car) => {
                const isBest = maxPower !== null && car.motorGucuHp === maxPower;
                return (
                  <td key={car.id} className="p-4 sm:p-5 border-l border-border/80">
                    <span className="font-bold text-main">{car.motorGucuHp} HP</span>
                    {isBest && (
                      <span className="inline-block ml-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        En Yüksek Güç
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* 6. Ortalama Tüketim */}
            <tr className="hover:bg-surface-elevated/20 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-muted text-xs uppercase tracking-wide">
                Karma Tüketim
              </td>
              {selectedCars.map((car) => {
                const isBest =
                  minConsumption !== null && car.ortalamaTuketim === minConsumption;
                return (
                  <td key={car.id} className="p-4 sm:p-5 border-l border-border/80">
                    <span className="font-bold text-main">
                      {car.ortalamaTuketim}{" "}
                      <span className="text-xs font-normal text-muted">
                        {car.yakit === "elektrik" ? "kWh/100km" : "L/100km"}
                      </span>
                    </span>
                    {isBest && (
                      <span className="inline-block ml-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        En Düşük Tüketim
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* 7. Menzil (Elektrikli) */}
            <tr className="hover:bg-surface-elevated/20 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-muted text-xs uppercase tracking-wide">
                Elektrikli Menzil
              </td>
              {selectedCars.map((car) => (
                <td key={car.id} className="p-4 sm:p-5 border-l border-border/80 text-muted">
                  {car.menzilKm ? (
                    <span className="font-bold text-primary">{car.menzilKm} km</span>
                  ) : (
                    <span className="text-xs text-muted/60">—</span>
                  )}
                </td>
              ))}
            </tr>

            {/* 8. Bagaj Hacmi */}
            <tr className="hover:bg-surface-elevated/20 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-muted text-xs uppercase tracking-wide">
                Bagaj Hacmi
              </td>
              {selectedCars.map((car) => {
                const isBest = maxBoot !== null && car.bagajLitre === maxBoot;
                return (
                  <td key={car.id} className="p-4 sm:p-5 border-l border-border/80">
                    <span className="font-bold text-main">{car.bagajLitre} Litre</span>
                    {isBest && (
                      <span className="inline-block ml-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        En Geniş Bagaj
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* 9. Koltuk Sayısı */}
            <tr className="hover:bg-surface-elevated/20 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-muted text-xs uppercase tracking-wide">
                Koltuk Sayısı
              </td>
              {selectedCars.map((car) => (
                <td key={car.id} className="p-4 sm:p-5 border-l border-border/80 font-medium text-main">
                  {car.koltukSayisi} Kişilik
                </td>
              ))}
            </tr>

            {/* 10. Güvenlik Puanı */}
            <tr className="hover:bg-surface-elevated/20 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-muted text-xs uppercase tracking-wide">
                Euro NCAP Güvenlik
              </td>
              {selectedCars.map((car) => {
                const isBest = maxSafety !== null && car.guvenlikPuani === maxSafety;
                return (
                  <td key={car.id} className="p-4 sm:p-5 border-l border-border/80">
                    <span className="font-bold text-amber-500">
                      {"★".repeat(car.guvenlikPuani)} ({car.guvenlikPuani}/5)
                    </span>
                    {isBest && car.guvenlikPuani === 5 && (
                      <span className="inline-block ml-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Maksimum Skor
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* 11. Tahmini Yıllık Masraf (15.000 km) */}
            <tr className="hover:bg-surface-elevated/20 transition-colors bg-surface-elevated/10">
              <td className="p-4 sm:p-5 font-semibold text-muted text-xs uppercase tracking-wide">
                Yıllık Masraf (15.000 km)
              </td>
              {selectedCars.map((car) => {
                const cost = costsMap.get(car.id) || 0;
                const isBest = minCost !== null && cost === minCost;
                return (
                  <td key={car.id} className="p-4 sm:p-5 border-l border-border/80">
                    <span className="font-heading font-extrabold text-main block">
                      {formatPrice(cost)} / yıl
                    </span>
                    <span className="text-[11px] text-muted block">
                      (Yakıt + Bakım + Sigorta)
                    </span>
                    {isBest && (
                      <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        En Ekonomik Yürütme
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* 12. Artılar */}
            <tr className="hover:bg-surface-elevated/20 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-muted text-xs uppercase tracking-wide align-top">
                Öne Çıkan Artılar
              </td>
              {selectedCars.map((car) => (
                <td key={car.id} className="p-4 sm:p-5 border-l border-border/80 align-top">
                  <ul className="space-y-1.5 text-xs text-main">
                    {car.artilar.map((arti, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{arti}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* 13. Eksiler */}
            <tr className="hover:bg-surface-elevated/20 transition-colors">
              <td className="p-4 sm:p-5 font-semibold text-muted text-xs uppercase tracking-wide align-top">
                Dikkat Edilmesi Gerekenler
              </td>
              {selectedCars.map((car) => (
                <td key={car.id} className="p-4 sm:p-5 border-l border-border/80 align-top">
                  <ul className="space-y-1.5 text-xs text-muted">
                    {car.eksiler.map((eksi, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">!</span>
                        <span>{eksi}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
