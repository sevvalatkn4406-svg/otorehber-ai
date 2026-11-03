"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { carsData } from "@/data/cars";
import { CarIcon } from "@/components/CarIcon";
import { formatPrice } from "@/lib/maliyet";
import { OneriCiktisi, BakimCiktisi } from "@/lib/yerelOneri";

type TabType = "oneri" | "bakim";

function AsistanContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "bakim" ? "bakim" : "oneri";

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  // --- 1. ÖNERİ FORMU STATE (Başlangıçta loading: false) ---
  const [butce, setButce] = useState<number>(1800000);
  const [gunlukKm, setGunlukKm] = useState<number>(40);
  const [aileDurumu, setAileDurumu] = useState<
    "yalniz" | "cift" | "cocuklu-aile" | "kalabalik-aile"
  >("cocuklu-aile");
  const [oncelikler, setOncelikler] = useState<string[]>([
    "yakit-ekonomisi",
    "guvenlik",
  ]);
  const [kullaniciNotu, setKullaniciNotu] = useState("");

  const [oneriYukleniyor, setOneriYukleniyor] = useState<boolean>(false);
  const [oneriSonucu, setOneriSonucu] = useState<{
    kaynak: "gemini" | "yerel";
    veri: OneriCiktisi;
    not?: string;
  } | null>(null);
  const [oneriHata, setOneriHata] = useState<string | null>(null);

  // --- 2. BAKIM FORMU STATE (Başlangıçta loading: false) ---
  const [aracModeli, setAracModeli] = useState("Toyota Corolla 1.8 Hybrid");
  const [bakimKm, setBakimKm] = useState<number>(45000);
  const [aracYasi, setAracYasi] = useState<number>(3);
  const [yakitTuru, setYakitTuru] = useState<
    "benzin" | "dizel" | "hibrit" | "elektrik"
  >("hibrit");

  const [bakimYukleniyor, setBakimYukleniyor] = useState<boolean>(false);
  const [bakimSonucu, setBakimSonucu] = useState<{
    kaynak: "gemini" | "yerel";
    veri: BakimCiktisi;
    not?: string;
  } | null>(null);
  const [bakimHata, setBakimHata] = useState<string | null>(null);

  // Checkbox toggle handler
  const handleOncelikToggle = (deg: string) => {
    setOncelikler((prev) =>
      prev.includes(deg) ? prev.filter((p) => p !== deg) : [...prev, deg]
    );
  };

  // Submit Oneri Handler
  const handleOneriSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOneriHata(null);
    setOneriYukleniyor(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const payload = {
        mod: "oneri",
        butce: Number(butce) || 1800000,
        gunlukKm: Number(gunlukKm) || 40,
        aileDurumu: aileDurumu || "cocuklu-aile",
        oncelikler: Array.isArray(oncelikler) ? oncelikler : [],
        not: (kullaniciNotu || "").trim(),
      };

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const errMsg = json?.error || `Sunucu hatası (${res.status})`;
        throw new Error(errMsg);
      }

      if (!json || !json.veri) {
        throw new Error("Sunucudan geçerli bir öneri yanıtı alınamadı.");
      }

      setOneriSonucu(json);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        setOneriHata("İstek zaman aşımına uğradı (15 saniye). Lütfen tekrar deneyiniz.");
      } else {
        const msg = err instanceof Error ? err.message : "Öneri hazırlanırken bir hata oluştu.";
        setOneriHata(msg);
      }
    } finally {
      clearTimeout(timeoutId);
      setOneriYukleniyor(false);
    }
  };

  // Submit Bakim Handler
  const handleBakimSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBakimHata(null);
    setBakimYukleniyor(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const payload = {
        mod: "bakim",
        aracModeli: (aracModeli || "").trim() || "Binek Araç",
        km: Number(bakimKm) || 45000,
        aracYasi: Number(aracYasi) || 3,
        yakitTuru: yakitTuru || "benzin",
      };

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const errMsg = json?.error || `Sunucu hatası (${res.status})`;
        throw new Error(errMsg);
      }

      if (!json || !json.veri) {
        throw new Error("Sunucudan geçerli bir bakım verisi alınamadı.");
      }

      setBakimSonucu(json);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        setBakimHata("İstek zaman aşımına uğradı (15 saniye). Lütfen tekrar deneyiniz.");
      } else {
        const msg = err instanceof Error ? err.message : "Bakım planı alınırken bir hata oluştu.";
        setBakimHata(msg);
      }
    } finally {
      clearTimeout(timeoutId);
      setBakimYukleniyor(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28">
      {/* Page Header */}
      <div className="max-w-3xl mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
          Akıllı Karar & Bakım Rehberi
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-main tracking-tight mb-3">
          OtoRehber AI Asistanı
        </h1>
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          Kullanım alışkanlıklarınıza en uygun araçları keşfedin veya mevcut aracınız için
          yaklaşan periyodik bakım kalemlerini yapay zekâ analizleriyle planlayın.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border mb-8 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("oneri")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-sm font-bold transition-all ${
            activeTab === "oneri"
              ? "bg-primary text-white shadow-sm"
              : "text-muted hover:text-main hover:bg-surface-elevated"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          <span>Bana Araç Öner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bakim")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-sm font-bold transition-all ${
            activeTab === "bakim"
              ? "bg-primary text-white shadow-sm"
              : "text-muted hover:text-main hover:bg-surface-elevated"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63" />
          </svg>
          <span>Bakım Planım</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: BANA ARAÇ ÖNER                                     */}
      {/* ========================================================= */}
      {activeTab === "oneri" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sol Kolon: Form */}
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-surface border border-border shadow-sm">
            <h2 className="text-xl font-bold font-heading text-main mb-5">
              İhtiyaç ve Kriterlerinizi Belirtin
            </h2>

            <form onSubmit={handleOneriSubmit} className="space-y-5">
              {/* Bütçe */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="butce-input" className="text-xs font-semibold text-main">
                    Maksimum Satın Alma Bütçesi
                  </label>
                  <span className="text-xs font-bold text-primary">
                    {formatPrice(butce)}
                  </span>
                </div>
                <input
                  id="butce-input"
                  type="range"
                  min="900000"
                  max="3500000"
                  step="50000"
                  value={butce}
                  onChange={(e) => setButce(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted mt-1">
                  <span>900.000 ₺</span>
                  <span>2.000.000 ₺</span>
                  <span>3.500.000 ₺</span>
                </div>
              </div>

              {/* Günlük KM */}
              <div>
                <label htmlFor="km-input" className="block text-xs font-semibold text-main mb-1.5">
                  Günlük Ortalama Yolculuk (km)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="km-input"
                    type="number"
                    min="5"
                    max="500"
                    step="5"
                    value={gunlukKm}
                    onChange={(e) => setGunlukKm(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-main font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-xs text-muted font-medium shrink-0">km / gün</span>
                </div>
              </div>

              {/* Aile Durumu */}
              <div>
                <label htmlFor="aile-select" className="block text-xs font-semibold text-main mb-1.5">
                  Kullanım & Aile Durumu
                </label>
                <select
                  id="aile-select"
                  value={aileDurumu}
                  onChange={(e) =>
                    setAileDurumu(e.target.value as "yalniz" | "cift" | "cocuklu-aile" | "kalabalik-aile")
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="yalniz">Yalnız / Bireysel Kullanım</option>
                  <option value="cift">Çift / 2 Kişilik Kullanım</option>
                  <option value="cocuklu-aile">Çocuklu Aile (1-2 Çocuk)</option>
                  <option value="kalabalik-aile">Geniş Aile / Yüksek Bagaj İhtiyacı</option>
                </select>
              </div>

              {/* Öncelikler (Fieldset / Legend Checkbox) */}
              <fieldset className="border border-border rounded-2xl p-4 bg-surface-elevated/40">
                <legend className="px-2 text-xs font-bold text-main uppercase tracking-wider">
                  Öncelikleriniz (Birden Fazla Seçebilirsiniz)
                </legend>
                <div className="grid grid-cols-2 gap-2.5 mt-2">
                  {[
                    { id: "yakit-ekonomisi", label: "Düşük Tüketim" },
                    { id: "guvenlik", label: "Maksimum Güvenlik" },
                    { id: "performans", label: "Yüksek Güç & Hız" },
                    { id: "konfor", label: "Geniş Alan & Konfor" },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 text-xs text-main cursor-pointer p-1.5 rounded-lg hover:bg-surface-elevated transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={oncelikler.includes(item.id)}
                        onChange={() => handleOncelikToggle(item.id)}
                        className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                      />
                      <span className="font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Ek Kullanıcı Notu */}
              <div>
                <label htmlFor="not-textarea" className="block text-xs font-semibold text-main mb-1.5">
                  Ek Beklentileriniz (Opsiyonel)
                </label>
                <textarea
                  id="not-textarea"
                  rows={2}
                  value={kullaniciNotu}
                  onChange={(e) => setKullaniciNotu(e.target.value)}
                  placeholder="Örn: Bebek arabası sığmalı, hibrit veya elektrikli olmasını tercih ederim..."
                  className="w-full px-3.5 py-2 rounded-xl bg-surface-elevated border border-border text-xs text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Submit Butonu */}
              <button
                type="submit"
                disabled={oneriYukleniyor}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-semibold text-sm transition-all shadow-md shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {oneriYukleniyor ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Araçlar Analiz Ediliyor...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    <span>Bana En Uygun 3 Aracı Öner</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sağ Kolon: Sonuç Alanı */}
          <div className="lg:col-span-7">
            {/* Hata Mesajı */}
            {oneriHata && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-sm mb-6 flex items-start gap-2">
                <span className="text-base shrink-0">⚠️</span>
                <div>
                  <span className="font-semibold block">Hata Oluştu</span>
                  <span>{oneriHata}</span>
                </div>
              </div>
            )}

            {/* Yükleniyor Durumu */}
            {oneriYukleniyor && (
              <div className="p-12 text-center rounded-3xl bg-surface border border-border">
                <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <h3 className="font-heading font-bold text-main text-lg mb-1">
                  Yapay Zekâ Analiz Ediyor
                </h3>
                <p className="text-xs text-muted">
                  Bütçeniz, kullanım alışkanlıklarınız ve güvenlik puanları değerlendiriliyor...
                </p>
              </div>
            )}

            {/* Henüz İstek Atılmadıysa: Boş Durum */}
            {!oneriYukleniyor && !oneriSonucu && (
              <div className="p-12 text-center rounded-3xl bg-surface border border-border">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-main text-lg mb-2">
                  Kişisel Araç Önerinizi Alın
                </h3>
                <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
                  Sol taraftaki formu doldurup &ldquo;Bana En Uygun 3 Aracı Öner&rdquo; butonuna bastığınızda,
                  kriterlerinize en uygun 3 model gerekçeleriyle birlikte listelenecektir.
                </p>
              </div>
            )}

            {/* Sonuç Geldiyse */}
            {!oneriYukleniyor && oneriSonucu && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Result Top Badge */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25">
                    {oneriSonucu.kaynak === "gemini" ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Gemini ile üretildi
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Yerel öneri sistemi
                      </>
                    )}
                  </div>
                  {oneriSonucu.not && (
                    <span className="text-[11px] text-muted italic max-w-xs text-right">
                      {oneriSonucu.not}
                    </span>
                  )}
                </div>

                {/* Genel Tavsiye Box */}
                {oneriSonucu.veri?.genelTavsiye && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-surface-elevated/70 border border-primary/30 text-sm text-main leading-relaxed">
                    <span className="font-bold text-primary block mb-1">
                      Uzman Tavsiyesi:
                    </span>
                    {oneriSonucu.veri.genelTavsiye}
                  </div>
                )}

                {/* 3 Recommended Cars */}
                <div className="space-y-4">
                  {(oneriSonucu.veri?.onerilenAraclar || []).map((item, idx) => {
                    const car = carsData.find((c) => c.id === item.id);
                    if (!car) return null;

                    return (
                      <div
                        key={car.id}
                        className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all shadow-sm flex flex-col sm:flex-row gap-5 items-center justify-between"
                      >
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="w-8 h-8 rounded-xl bg-primary text-white font-heading font-bold text-sm flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>
                          <div className="w-28 h-16 rounded-xl bg-surface-elevated flex items-center justify-center p-1 shrink-0">
                            <CarIcon kasaTipi={car.kasaTipi} className="w-24 h-auto" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-[11px] uppercase font-bold text-primary">
                              <span>{car.marka}</span>
                              <span className="text-muted font-normal">&bull;</span>
                              <span className="text-muted font-medium capitalize">{car.kasaTipi}</span>
                            </div>
                            <h4 className="text-base font-bold font-heading text-main">
                              {car.model}
                            </h4>
                            <span className="text-xs font-semibold text-muted">
                              {formatPrice(car.fiyatMin)} - {formatPrice(car.fiyatMax)}
                            </span>
                          </div>
                        </div>

                        {/* Rationale Bubble */}
                        <div className="w-full sm:max-w-xs text-xs text-muted bg-surface-elevated/60 p-3 rounded-xl border border-border/80">
                          <span className="font-semibold text-main block mb-0.5">Neden Önerildi?</span>
                          {item.gerekce}
                        </div>

                        {/* Detail Link */}
                        <Link
                          href={`/araclar/${car.id}`}
                          className="w-full sm:w-auto text-center px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-border text-main font-semibold text-xs transition-colors border border-border shrink-0"
                        >
                          Detay &rarr;
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {/* Static Disclaimer */}
                <div className="p-3.5 rounded-xl bg-surface-elevated/40 border border-border/70 text-xs text-muted text-center leading-relaxed">
                  Yapay zekâ cevapları bilgilendirme amaçlıdır; satın alma veya bakım kararı öncesi yetkili servis ve uzmanlara danışın.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: BAKIM PLANIM                                       */}
      {/* ========================================================= */}
      {activeTab === "bakim" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sol Kolon: Form */}
          <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-surface border border-border shadow-sm">
            <h2 className="text-xl font-bold font-heading text-main mb-5">
              Aracınızın Bilgilerini Girin
            </h2>

            <form onSubmit={handleBakimSubmit} className="space-y-4">
              <div>
                <label htmlFor="arac-model-input" className="block text-xs font-semibold text-main mb-1.5">
                  Araç Marka & Modeli
                </label>
                <input
                  id="arac-model-input"
                  type="text"
                  value={aracModeli}
                  onChange={(e) => setAracModeli(e.target.value)}
                  placeholder="Örn: Volkswagen Golf 1.5 eTSI veya Togg T10X"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="bakim-km-input" className="block text-xs font-semibold text-main mb-1.5">
                    Mevcut Kilometre
                  </label>
                  <input
                    id="bakim-km-input"
                    type="number"
                    min="0"
                    max="500000"
                    step="1000"
                    value={bakimKm}
                    onChange={(e) => setBakimKm(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-main font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="arac-yasi-input" className="block text-xs font-semibold text-main mb-1.5">
                    Araç Yaşı (Yıl)
                  </label>
                  <input
                    id="arac-yasi-input"
                    type="number"
                    min="0"
                    max="30"
                    value={aracYasi}
                    onChange={(e) => setAracYasi(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-main font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="yakit-turu-select" className="block text-xs font-semibold text-main mb-1.5">
                  Motor & Yakıt Türü
                </label>
                <select
                  id="yakit-turu-select"
                  value={yakitTuru}
                  onChange={(e) =>
                    setYakitTuru(
                      e.target.value as "benzin" | "dizel" | "hibrit" | "elektrik"
                    )
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="benzin">Benzinli</option>
                  <option value="dizel">Dizel (Turbo Dizel)</option>
                  <option value="hibrit">Hibrit (HEV / MHEV)</option>
                  <option value="elektrik">Tam Elektrikli (BEV)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={bakimYukleniyor}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-semibold text-sm transition-all shadow-md shadow-primary/25 flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                {bakimYukleniyor ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Bakım Planı Hazırlanıyor...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63" />
                    </svg>
                    <span>Bakım Planını Oluştur</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sağ Kolon: Sonuç Alanı */}
          <div className="lg:col-span-7">
            {/* Hata Mesajı */}
            {bakimHata && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-sm mb-6 flex items-start gap-2">
                <span className="text-base shrink-0">⚠️</span>
                <div>
                  <span className="font-semibold block">Hata Oluştu</span>
                  <span>{bakimHata}</span>
                </div>
              </div>
            )}

            {/* Yükleniyor Durumu */}
            {bakimYukleniyor && (
              <div className="p-12 text-center rounded-3xl bg-surface border border-border">
                <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                <h3 className="font-heading font-bold text-main text-lg mb-1">
                  Bakım Takvimi Çıkarılıyor
                </h3>
                <p className="text-xs text-muted">
                  Kilometre, parça yıpranma oranları ve resmi servis aralıkları taranıyor...
                </p>
              </div>
            )}

            {/* Henüz İstek Atılmadıysa: Boş Durum */}
            {!bakimYukleniyor && !bakimSonucu && (
              <div className="p-12 text-center rounded-3xl bg-surface border border-border">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63" />
                  </svg>
                </div>
                <h3 className="font-heading font-bold text-main text-lg mb-2">
                  Aracınızın Bakım Yol Haritası
                </h3>
                <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
                  Aracınızın mevcut kilometre ve yaşını girerek yaklaşan periyodik bakım kalemlerini,
                  tahmini parça masraflarını ve kritik güvenlik noktalarını anında görüntüleyin.
                </p>
              </div>
            )}

            {/* Sonuç Geldiyse */}
            {!bakimYukleniyor && bakimSonucu && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Result Top Badge */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25">
                    {bakimSonucu.kaynak === "gemini" ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Gemini ile üretildi
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Yerel öneri sistemi
                      </>
                    )}
                  </div>
                  <span className="text-xs font-bold text-main">
                    {bakimSonucu.veri?.aracBilgisi}
                  </span>
                </div>

                {/* Maintenance Items List */}
                <div className="space-y-3">
                  {(bakimSonucu.veri?.kalemler || []).map((item, idx) => {
                    const onemColor =
                      item.onemDerecesi === "yuksek"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                        : item.onemDerecesi === "orta"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";

                    return (
                      <div
                        key={idx}
                        className="p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${onemColor}`}
                            >
                              {item.onemDerecesi} Öncelik
                            </span>
                            <h4 className="font-heading font-bold text-main text-sm sm:text-base">
                              {item.kalem}
                            </h4>
                          </div>
                          <p className="text-xs text-muted leading-relaxed max-w-xl">
                            {item.aciklama}
                          </p>
                          <span className="inline-block text-[11px] text-muted font-medium">
                            Zaman/Periyot: <strong className="text-main">{item.onerilenZamanKm}</strong>
                          </span>
                        </div>

                        <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                          <span className="block text-[11px] text-muted">Tahmini Masraf</span>
                          <span className="font-heading font-bold text-sm text-primary">
                            {item.tahminiMasraf}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tips */}
                {(bakimSonucu.veri?.tavsiyeler || []).length > 0 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-surface-elevated/70 border border-border">
                    <h4 className="font-heading font-bold text-sm text-main mb-2">
                      Sürücü Tavsiyeleri:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-muted">
                      {bakimSonucu.veri.tavsiyeler.map((tavsiye, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>{tavsiye}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Static Disclaimer */}
                <div className="p-3.5 rounded-xl bg-surface-elevated/40 border border-border/70 text-xs text-muted text-center leading-relaxed">
                  Yapay zekâ cevapları bilgilendirme amaçlıdır; satın alma veya bakım kararı öncesi yetkili servis ve uzmanlara danışın.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AsistanPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted text-sm">
          Asistan Yükleniyor...
        </div>
      }
    >
      <AsistanContent />
    </Suspense>
  );
}
