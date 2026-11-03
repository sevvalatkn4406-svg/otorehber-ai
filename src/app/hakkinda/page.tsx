import type { Metadata } from "next";
import Link from "next/link";
import { FeedbackForm } from "@/components/FeedbackForm";

export const metadata: Metadata = {
  title: "Hakkında",
  description: "OtoRehber AI projesinin amacı, kapsamı ve veri yaklaşımı.",
};

export default function HakkindaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="p-6 sm:p-12 rounded-3xl bg-surface border border-border shadow-sm">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
          Proje Hakkında
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-main tracking-tight mb-6">
          OtoRehber AI Nedir?
        </h1>
        <div className="space-y-4 text-muted text-base leading-relaxed">
          <p>
            OtoRehber AI; ilk kez araç alacaklar, aile aracı arayanlar, performans meraklıları ve araç sahipleri için araçları karşılaştırmaya ve bakım adımlarını planlamaya yardımcı olan bir öğrenci projesidir.
          </p>
          <p>
            Öneriler; bütçe, kullanım alışkanlıkları, yakıt ekonomisi, tahmini güvenlik puanı ve bagaj kapasitesi gibi ölçütleri açık varsayımlarla ele alır. Araç verileri ve fiyat aralıkları örnek ve tahminidir; resmi üretici, Euro NCAP veya bayi verisi olarak değerlendirilmemelidir.
          </p>
          <div className="p-4 rounded-xl bg-surface-elevated border border-border text-sm text-muted">
            <span className="font-semibold text-main">Proje notu:</span> YZO 205 Operasyonel Yapay Zekâ dersi kapsamında geliştirilmiş öğrenci projesidir.
          </div>
          <div className="p-4 rounded-xl bg-surface-elevated border border-border text-sm text-muted">
            Yapay zekâ yanıtları bilgilendirme amaçlıdır. Araç satın alma ve bakım kararlarında üretici bilgilerini ve yetkili servis önerilerini ayrıca kontrol edin.
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border">
          <h2 className="text-2xl font-bold font-heading text-main mb-2">İletişim ve geri bildirim</h2>
          <p className="text-sm text-muted mb-5">Öneri ve hata bildirimlerini form üzerinden iletebilirsiniz.</p>
          <FeedbackForm />
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-colors shadow-sm">
            &larr; Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
