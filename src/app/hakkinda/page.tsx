import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hakkında",
  description: "OtoRehber AI projesinin amacı, vizyonu ve şeffaf veri yaklaşımı.",
};

export default function HakkindaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-border shadow-sm">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
          Proje Hakkında
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-main tracking-tight mb-6">
          OtoRehber AI Nedir?
        </h1>
        <div className="space-y-4 text-muted text-base leading-relaxed">
          <p>
            OtoRehber AI; araç satın alma arifesinde olan sürücüler ile mevcut araç sahiplerine yönelik, şeffaf teknik veriler ve yapay zekâ analizleriyle rehberlik etmeyi amaçlayan bağımsız bir web platformudur.
          </p>
          <p>
            Platformumuz, kullanıcıların bütçe, yakıt ekonomisi, güvenlik puanları (Euro NCAP) ve bagaj kapasitesi gibi somut kriterleri göz önünde bulundurarak en doğru aracı seçmelerine yardımcı olur.
          </p>
          <div className="p-4 rounded-xl bg-surface-elevated border border-border text-xs text-muted">
            <span className="font-semibold text-main">Önemli Hatırlatma:</span> Platformda sunulan araç teknik özellikleri, tahmini fiyat aralıkları ve bakım maliyetleri eğitim ve örnekleme amaçlı hazırlanmış olup resmi bayi veya garanti taahhüdü içermez.
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-colors shadow-sm"
          >
            &larr; Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
