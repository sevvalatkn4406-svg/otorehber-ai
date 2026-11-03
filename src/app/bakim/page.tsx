import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Periyodik Bakım Takvimi",
  description: "Aracınızın motor, fren, filtre ve akü kontrol aralıklarını takip edin, bakım maliyetlerini öngörün.",
};

export default function BakimPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-border shadow-sm">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
          Araç Sağlığı & Bakım
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-main tracking-tight mb-4">
          Periyodik Bakım Takvimi
        </h1>
        <p className="text-muted text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Kilometreye ve yıla göre yağ, filtre, triger kayışı, buji, fren balatası ve batarya sağlığı takip modülü yakında aktif olacaktır.
        </p>

        <div className="inline-flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-colors shadow-sm"
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/araclar"
            className="px-6 py-3 rounded-xl bg-surface-elevated hover:bg-border text-main font-semibold text-sm transition-colors border border-border"
          >
            Araç Veritabanı
          </Link>
        </div>
      </div>
    </div>
  );
}
