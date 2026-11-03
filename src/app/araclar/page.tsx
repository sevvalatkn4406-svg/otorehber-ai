import type { Metadata } from "next";
import Link from "next/link";
import { carsData } from "@/data/cars";
import { CarIcon } from "@/components/CarIcon";

export const metadata: Metadata = {
  title: "Araç Modelleri",
  description: "Tüm segmentlerden güncel araç modellerini teknik özellikleri ve tahmini fiyatlarıyla inceleyin.",
};

export default function AraclarPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
          Kapsamlı Araç Veritabanı
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-main tracking-tight mb-3">
          Tüm Araç Modelleri
        </h1>
        <p className="text-muted text-base leading-relaxed">
          Gelişmiş filtreleme, detaylı teknik özellikler ve galeri modülü yakında aktif olacaktır. Şu anda sistemimizde kayıtlı {carsData.length} araç modelinden bazı örnekler aşağıdadır:
        </p>
      </div>

      {/* Preview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {carsData.slice(0, 6).map((car) => (
          <div
            key={car.id}
            className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="h-32 flex items-center justify-center p-2 mb-4 bg-surface-elevated/50 rounded-xl">
                <CarIcon kasaTipi={car.kasaTipi} className="w-48 h-auto" />
              </div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs uppercase font-bold tracking-wider text-primary">
                  {car.marka}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-surface-elevated text-muted capitalize font-medium">
                  {car.kasaTipi}
                </span>
              </div>
              <h2 className="text-lg font-bold font-heading text-main mb-2">
                {car.model}
              </h2>
              <p className="text-xs text-muted mb-4">
                {car.motorGucuHp} HP &bull; {car.yakit} &bull; {car.vites} &bull; {car.ortalamaTuketim} {car.yakit === "elektrik" ? "kWh/100km" : "L/100km"}
              </p>
            </div>
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted">Tahmini Aralık:</span>
              <span className="font-semibold text-main">
                {(car.fiyatMin / 1000000).toFixed(2)}M - {(car.fiyatMax / 1000000).toFixed(2)}M TL
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Back to Home CTA */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-elevated hover:bg-border text-main font-semibold text-sm transition-colors border border-border"
        >
          &larr; Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
