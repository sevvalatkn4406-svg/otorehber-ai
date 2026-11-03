import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { carsData } from "@/data/cars";
import { CarIcon } from "@/components/CarIcon";
import { formatPrice } from "@/lib/maliyet";
import { CostCalculator } from "@/components/CostCalculator";
import { DetailActionButtons } from "@/components/DetailActionButtons";
import { CompareFloatingBar } from "@/components/CompareFloatingBar";

export function generateStaticParams() {
  return carsData.map((car) => ({
    id: car.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const car = carsData.find((c) => c.id === id);

  if (!car) {
    return {
      title: "Araç Bulunamadı",
      description: "Aradığınız araç modeli sistemimizde bulunamadı.",
    };
  }

  return {
    title: `${car.marka} ${car.model} (${car.yil}) Fiyatı ve Özellikleri`,
    description: `${car.marka} ${car.model} teknik özellikleri, ${car.motorGucuHp} HP güç, ${car.ortalamaTuketim} tüketim, artı ve eksi yönleri, tahmini kullanım maliyetleri.`,
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = carsData.find((c) => c.id === id);

  if (!car) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Ekmek Kırıntısı" className="flex items-center gap-2 text-xs text-muted mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Ana Sayfa
        </Link>
        <span>/</span>
        <Link href="/araclar" className="hover:text-primary transition-colors">
          Araçlar
        </Link>
        <span>/</span>
        <span className="text-main font-medium truncate">
          {car.marka} {car.model}
        </span>
      </nav>

      {/* Hero Header Area */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Info & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs uppercase font-extrabold tracking-widest text-primary">
                  {car.marka}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-elevated text-muted font-semibold">
                  {car.yil} Model
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold capitalize">
                  {car.kasaTipi}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-elevated text-muted capitalize">
                  {car.yakit}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-main tracking-tight mb-4">
                {car.model}
              </h1>

              <div className="mb-6">
                <span className="block text-xs text-muted mb-1">
                  Tahmini Piyasa Değer Aralığı
                </span>
                <span className="text-2xl sm:text-3xl font-black font-heading text-main">
                  {formatPrice(car.fiyatMin)} - {formatPrice(car.fiyatMax)}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {car.etiketler.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-muted font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Favorite & Compare Action Buttons */}
            <DetailActionButtons carId={car.id} />
          </div>

          {/* Right: Silhouette Illustration */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-surface-elevated/50 border border-border flex items-center justify-center">
            <CarIcon
              kasaTipi={car.kasaTipi}
              className="w-full max-w-[340px] h-auto drop-shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Grid: Technical Specs & Pros/Cons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Technical Specs Table */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm">
          <h2 className="text-xl font-bold font-heading text-main mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            Teknik Özellikler
          </h2>

          <div className="divide-y divide-border text-sm">
            <div className="py-3 flex items-center justify-between">
              <span className="text-muted">Kasa Tipi</span>
              <span className="font-semibold text-main capitalize">{car.kasaTipi}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-muted">Yakıt / Enerji Türü</span>
              <span className="font-semibold text-main capitalize">{car.yakit}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-muted">Şanzıman / Vites</span>
              <span className="font-semibold text-main capitalize">{car.vites}</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-muted">Motor Gücü</span>
              <span className="font-semibold text-main">{car.motorGucuHp} HP</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-muted">Karma Ortalama Tüketim</span>
              <span className="font-semibold text-main">
                {car.ortalamaTuketim} {car.yakit === "elektrik" ? "kWh / 100km" : "L / 100km"}
              </span>
            </div>
            {car.menzilKm && (
              <div className="py-3 flex items-center justify-between">
                <span className="text-muted">Tahmini Elektrikli Menzil (WLTP)</span>
                <span className="font-bold text-primary">{car.menzilKm} km</span>
              </div>
            )}
            <div className="py-3 flex items-center justify-between">
              <span className="text-muted">Bagaj Hacmi</span>
              <span className="font-semibold text-main">{car.bagajLitre} Litre</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-muted">Koltuk Kapasitesi</span>
              <span className="font-semibold text-main">{car.koltukSayisi} Kişilik</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <span className="text-muted">Güvenlik Değerlendirmesi</span>
              <span className="font-bold text-amber-500">
                {"★".repeat(car.guvenlikPuani)} ({car.guvenlikPuani} / 5)
              </span>
            </div>
          </div>
        </div>

        {/* Pros and Cons (Artılar & Eksiler) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Artılar */}
          <div className="p-6 rounded-3xl bg-surface border border-emerald-500/20 shadow-sm flex-1">
            <h3 className="text-lg font-bold font-heading text-emerald-500 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Öne Çıkan Artı Yönleri
            </h3>
            <ul className="space-y-3">
              {car.artilar.map((arti, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-main leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    ✓
                  </span>
                  <span>{arti}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eksiler */}
          <div className="p-6 rounded-3xl bg-surface border border-amber-500/20 shadow-sm flex-1">
            <h3 className="text-lg font-bold font-heading text-amber-500 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              Dikkat Edilmesi Gereken Yönler
            </h3>
            <ul className="space-y-3">
              {car.eksiler.map((eksi, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-main leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    !
                  </span>
                  <span>{eksi}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Cost Calculator Section */}
      <CostCalculator car={car} />

      {/* Floating Compare Bottom Bar */}
      <CompareFloatingBar />
    </div>
  );
}
