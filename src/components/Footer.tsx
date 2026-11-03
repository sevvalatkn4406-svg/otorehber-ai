import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface text-muted mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 13 L5 7 C6 5.5 8 5 12 5 C16 5 18 5.5 19 7 L21 13" />
                  <path d="M2 13 C2 12.5 3 12 5 12 L19 12 C21 12 22 12.5 22 13 L21 17 C20 18.5 18 19 12 19 C6 19 4 18.5 3 17 Z" />
                </svg>
              </div>
              <span className="font-heading text-lg font-bold text-main tracking-tight">
                OtoRehber <span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted max-w-md leading-relaxed">
              Araç almak isteyenler ve araç sahipleri için akıllı araç keşif,
              teknik karşılaştırma ve periyodik bakım asistanı. İhtiyacınıza en
              uygun aracı şeffaf verilerle keşfedin.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-heading text-sm font-semibold text-main tracking-wider uppercase">
              Hızlı Erişim
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/araclar" className="hover:text-primary transition-colors">
                  Araç Modelleri
                </Link>
              </li>
              <li>
                <Link href="/karsilastir" className="hover:text-primary transition-colors">
                  Araç Karşılaştır
                </Link>
              </li>
              <li>
                <Link href="/asistan" className="hover:text-primary transition-colors">
                  AI Araç Asistanı
                </Link>
              </li>
            </ul>
          </div>

          {/* Services & Info */}
          <div className="flex flex-col gap-2.5">
            <h3 className="font-heading text-sm font-semibold text-main tracking-wider uppercase">
              Rehber & Bilgi
            </h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="/bakim" className="hover:text-primary transition-colors">
                  Bakım Takvimi
                </Link>
              </li>
              <li>
                <Link href="/hakkinda" className="hover:text-primary transition-colors">
                  Proje Hakkında
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Note & Copyright */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted text-center sm:text-left">
          <p className="p-2.5 rounded-lg bg-surface-elevated/70 border border-border/60 text-muted max-w-2xl">
            <span className="font-semibold text-main">Önemli Bilgilendirme:</span>{" "}
            Araç verileri örnek amaçlıdır; fiyatlar ve değerler tahminidir.
            Satın alma öncesi yetkili satıcı ve resmi bayilerle iletişime geçiniz.
          </p>
          <p className="whitespace-nowrap">
            &copy; 2026 OtoRehber AI. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
