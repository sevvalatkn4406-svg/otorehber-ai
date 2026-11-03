import Link from "next/link";
import { CarIcon } from "@/components/CarIcon";
import { carsData } from "@/data/cars";

export default function Home() {
  // Select 4 showcase vehicles representing different segments
  const showcaseCars = [
    carsData.find((c) => c.id === "togg-t10x-2024") || carsData[12],
    carsData.find((c) => c.id === "toyota-corolla-hybrid-2024") || carsData[0],
    carsData.find((c) => c.id === "peugeot-3008-2024") || carsData[9],
    carsData.find((c) => c.id === "volkswagen-golf-2024") || carsData[5],
  ];

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-8 sm:pb-16 border-b border-border/60 bg-gradient-to-b from-surface-elevated/40 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25 mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Yapay Zekâ Destekli Akıllı Otomotiv Platformu
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-main tracking-tight leading-[1.12] mb-6">
                Aradığın Aracı Bul,{" "}
                <span className="text-primary underline decoration-primary/40 underline-offset-4">
                  Karşılaştır
                </span>
                , Güvenle Sür.
              </h1>

              <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed mb-8">
                Bütçene, sürüş alışkanlıklarına ve aile ihtiyaçlarına en uygun
                modeli örnek veriler ve açık varsayımlarla keşfet. Yapay zekâ destekli analiz
                sayesinde araçları kıyasla ve bakım adımlarını kolayca planla.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <Link
                  href="/asistan"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                  Sana Uygun Aracı Bul
                </Link>

                <Link
                  href="/araclar"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-surface hover:bg-surface-elevated text-main font-semibold text-base border border-border hover:border-muted/40 transition-colors"
                >
                  Araçları Keşfet
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>

              {/* Scope & Capability Tags (Objective, no fake counters) */}
              <div className="mt-8 pt-6 border-t border-border/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  20 Farklı Araç Modeli
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Tüm Kasa & Yakıt Tipleri
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  Örnek veriler ve açık varsayımlar
                </span>
              </div>
            </div>

            {/* Right Hero Visual: Dynamic Vehicle Silhouette Card */}
            <div className="lg:col-span-5">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-bold tracking-wider text-primary">
                    Öne Çıkan Silüet
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    Elektrikli SUV
                  </span>
                </div>

                <div className="py-6 flex items-center justify-center text-main">
                  <CarIcon
                    kasaTipi="elektrikli"
                    className="w-full max-w-[320px] h-auto drop-shadow-md"
                  />
                </div>

                <div className="pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-surface-elevated">
                    <span className="block text-[11px] text-muted">Tahmini menzil</span>
                    <span className="font-heading font-bold text-sm text-main">
                      523 km
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-elevated">
                    <span className="block text-[11px] text-muted">Tahmini güç</span>
                    <span className="font-heading font-bold text-sm text-main">
                      218 HP
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-elevated">
                    <span className="block text-[11px] text-muted">Tahmini güvenlik puanı</span>
                    <span className="font-heading font-bold text-sm text-amber-500">
                      ★ 5.0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KİMLER İÇİN? (4 HEDEF KİTLE KARTI) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
            Hedef Kitle Odaklı Yaklaşım
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-main tracking-tight">
            OtoRehber AI Kimler İçin?
          </h2>
          <p className="mt-3 text-muted text-sm sm:text-base leading-relaxed">
            Farklı sürüş beklentileri ve bütçe aralıkları için özel olarak tasarlanan rehber modülleri.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold font-heading text-main mb-2">
                İlk Kez Araç Alacaklar
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Satın alma bütçesi, düşük yakıt sarfiyatı, kolay park edilebilirlik ve uygun bakım giderlerine sahip kompakt modelleri rehberlikle seçin.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border text-xs font-semibold text-primary">
              Bütçe ve Ekonomi Odaklı &rarr;
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold font-heading text-main mb-2">
                Aile Aracı Arayanlar
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Tahmini güvenlik puanı yüksek ve 500 litreden fazla bagaj hacmi sunan örnek alternatifler.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border text-xs font-semibold text-sky-500">
              Güvenlik ve Geniş Hacim &rarr;
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold font-heading text-main mb-2">
                Performans Meraklıları
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Yüksek beygir gücü (HP), seri ara hızlanma, tork değerleri ve viraj kararlılığı ile sürüş dinamizmini ön planda tutan otomobiller.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border text-xs font-semibold text-amber-500">
              Dinamik Güç ve Çeviklik &rarr;
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.32l-3.276 3.277a3.003 3.003 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.32 4.486c.049.58.025 1.193-.139 1.743" />
                </svg>
              </div>
              <h3 className="text-lg font-bold font-heading text-main mb-2">
                Araç Sahipleri
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Kilometre ve yıla dayalı periyodik bakım takvimi, motor yağı, fren balatası, filtre değişim döngüleri ve araç sağlığı ipuçları.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-border text-xs font-semibold text-emerald-500">
              Bakım Takvimi & Sağlık &rarr;
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI ASİSTAN TANITIMI: NASIL ÇALIŞIR? (3 ADIMDA) */}
      <section className="bg-surface-elevated/50 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
              Akıllı Süreç
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-heading text-main tracking-tight">
              AI Asistan Nasıl Çalışır?
            </h2>
            <p className="mt-3 text-muted text-sm sm:text-base leading-relaxed">
              Yapay zekâ motorumuz, ihtiyaçlarınızı 3 adımda analiz ederek nokta atışı araç önerileri üretir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-surface border border-border flex flex-col relative shadow-sm">
              <span className="w-10 h-10 rounded-full bg-primary text-white font-heading font-bold text-base flex items-center justify-center mb-6 shadow-md shadow-primary/20">
                1
              </span>
              <h3 className="text-xl font-bold font-heading text-main mb-3">
                Kriterlerini Belirt
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Bütçeni, yıllık katettiğin ortalama kilometreyi, sürüş ağırlığını (şehir içi vs. uzun yol), kasa tipini ve yakıt tercihini sisteme aktar.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-surface border border-border flex flex-col relative shadow-sm">
              <span className="w-10 h-10 rounded-full bg-primary text-white font-heading font-bold text-base flex items-center justify-center mb-6 shadow-md shadow-primary/20">
                2
              </span>
              <h3 className="text-xl font-bold font-heading text-main mb-3">
                Akıllı Analiz & Eşleştirme
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Yapay zekâ motoru; motor gücü, yakıt tüketimi, tahmini güvenlik puanı ve varsayımsal yürütme maliyeti gibi örnek ölçütleri kullanarak alternatifleri eşleştirir.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-surface border border-border flex flex-col relative shadow-sm">
              <span className="w-10 h-10 rounded-full bg-primary text-white font-heading font-bold text-base flex items-center justify-center mb-6 shadow-md shadow-primary/20">
                3
              </span>
              <h3 className="text-xl font-bold font-heading text-main mb-3">
                Karşılaştır ve Karar Ver
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                Önerilen modellerin artı ve eksi yönlerini, tahmini fiyat aralıklarını ve teknik özelliklerini yan yana kıyaslayarak bilinçli karar vermene yardımcı ol.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/asistan"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all shadow-md shadow-primary/20"
            >
              Asistanı Başlat
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. ÖZELLİKLER BÖLÜMÜ (KEŞİF, KARŞILAŞTIRMA, GARAJIM, BAKIM TAKVİMİ) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
            Platform Yetenekleri
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading text-main tracking-tight">
            Tüm İhtiyaçlarınız İçin Modüller
          </h2>
          <p className="mt-3 text-muted text-sm sm:text-base leading-relaxed">
            Araç satın alımından periyodik bakıma kadar aracınızla ilgili tüm adımları tek ekrandan yönetin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature 1: Keşif */}
          <div className="p-8 rounded-3xl bg-surface border border-border hover:border-primary/40 transition-colors shadow-sm flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-main mb-2">
                Gelişmiş Araç Keşfi
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Kasa tipi (sedan, SUV, hatchback, elektrikli), yakıt cinsi, şanzıman ve bütçeye göre filtreleme yapın. Detaylı teknik verileri anında görüntüleyin.
              </p>
              <Link href="/araclar" className="text-xs font-bold text-primary hover:underline">
                Araç Modellerini Listele &rarr;
              </Link>
            </div>
          </div>

          {/* Feature 2: Karşılaştırma */}
          <div className="p-8 rounded-3xl bg-surface border border-border hover:border-primary/40 transition-colors shadow-sm flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-main mb-2">
                Teknik Karşılaştırma
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Beğendiğiniz araçları yan yana getirin; motor gücü, ortalama tüketim, bagaj hacmi ve fiyat aralıklarını tek tabloda kıyaslayarak farkları net görün.
              </p>
              <Link href="/karsilastir" className="text-xs font-bold text-sky-500 hover:underline">
                Karşılaştırma Aracını Aç &rarr;
              </Link>
            </div>
          </div>

          {/* Feature 3: Garajım */}
          <div className="p-8 rounded-3xl bg-surface border border-border hover:border-primary/40 transition-colors shadow-sm flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V4.5A1.5 1.5 0 0012.75 3h-1.5A1.5 1.5 0 009.75 4.5v3" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-main mb-2">
                Dijital Garajım
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Kullandığınız veya ilgilendiğiniz araç modellerini favori listenize ekleyip temel teknik verilerini takip edin.
              </p>
              <Link href="/araclar" className="text-xs font-bold text-amber-500 hover:underline">
                Garajına Araç Ekle &rarr;
              </Link>
            </div>
          </div>

          {/* Feature 4: Bakım Takvimi */}
          <div className="p-8 rounded-3xl bg-surface border border-border hover:border-primary/40 transition-colors shadow-sm flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-main mb-2">
                Periyodik Bakım Takvimi
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                Motor yağı, polen/hava filtreleri, fren diskleri, bujiler ve batarya kontrolleri için kilometre ve yıl sınırlarını takip edin.
              </p>
              <Link href="/bakim" className="text-xs font-bold text-emerald-500 hover:underline">
                Bakım Takvimini İncele &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ÖRNEK ARAÇ VİTRİNİ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
              Örnek Modeller
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-main tracking-tight">
              Segmentlerinden Seçilen Araçlar
            </h2>
          </div>
          <Link
            href="/araclar"
            className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1 group"
          >
            Tüm 20 Aracı İncele
            <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseCars.map((car) => (
            <div
              key={car.id}
              className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="h-28 flex items-center justify-center p-2 mb-3 bg-surface-elevated/40 rounded-xl">
                  <CarIcon kasaTipi={car.kasaTipi} className="w-40 h-auto" />
                </div>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-bold text-primary uppercase">{car.marka}</span>
                  <span className="px-2 py-0.5 rounded bg-surface-elevated text-muted capitalize font-medium">
                    {car.kasaTipi}
                  </span>
                </div>
                <h3 className="text-base font-bold font-heading text-main mb-2 line-clamp-1">
                  {car.model}
                </h3>
                <div className="text-xs text-muted space-y-1 mb-4">
                  <p>
                    Güç: <span className="font-semibold text-main">{car.motorGucuHp} HP</span> &bull; {car.yakit}
                  </p>
                  <p>
                    Tüketim: <span className="font-semibold text-main">{car.ortalamaTuketim} {car.yakit === "elektrik" ? "kWh/100km" : "L/100km"}</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted">Tahmini Fiyat:</span>
                <span className="font-bold text-main">
                  {(car.fiyatMin / 1000000).toFixed(2)}M TL
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-surface-elevated via-surface to-surface border border-border text-center shadow-lg relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-2xl sm:text-4xl font-bold font-heading text-main tracking-tight mb-4">
              Hangi Aracın Sana Uygun Olduğundan Emin Değil misin?
            </h2>
            <p className="text-sm sm:text-base text-muted mb-8 leading-relaxed">
              Kullanım alışkanlıklarını birkaç saniyede yanıtla; akıllı asistanımız senin kriterlerine en yakın modelleri artı ve eksi yönleriyle listelesin.
            </p>
            <Link
              href="/asistan"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-base transition-all shadow-lg shadow-primary/25 hover:scale-[1.02]"
            >
              Asistan ile Araç Bul
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
