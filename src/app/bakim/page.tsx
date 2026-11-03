"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useMaintenanceRecord, MaintenanceRecord } from "@/lib/storage";

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

interface ItemStatus {
  durum: "gecikmis" | "yaklasiyor" | "guvende" | "belirsiz";
  metin: string;
  badgeMetni: string;
}

function hesaplaHedefTarihDurumu(
  hedefTarihStr: string,
  bugun: Date | null,
  uyariGunu: number = 30
): ItemStatus {
  if (!hedefTarihStr || !bugun) {
    return {
      durum: "belirsiz",
      metin: "Tarih girilmedi",
      badgeMetni: "Tarih Belirtilmedi",
    };
  }

  const hedef = new Date(hedefTarihStr);
  if (isNaN(hedef.getTime())) {
    return {
      durum: "belirsiz",
      metin: "Geçersiz tarih",
      badgeMetni: "Belirsiz",
    };
  }

  // Sadece gün farkı hesabı için saatleri sıfırla
  const bugunMid = new Date(bugun.getFullYear(), bugun.getMonth(), bugun.getDate()).getTime();
  const hedefMid = new Date(hedef.getFullYear(), hedef.getMonth(), hedef.getDate()).getTime();

  const diffMs = hedefMid - bugunMid;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const gecen = Math.abs(diffDays);
    return {
      durum: "gecikmis",
      metin: `${gecen} gün gecikti!`,
      badgeMetni: "Gecikmiş",
    };
  }

  if (diffDays === 0) {
    return {
      durum: "yaklasiyor",
      metin: "Bugün son gün!",
      badgeMetni: "Bugün",
    };
  }

  if (diffDays <= uyariGunu) {
    return {
      durum: "yaklasiyor",
      metin: `${diffDays} gün kaldı`,
      badgeMetni: "Yaklaşıyor",
    };
  }

  return {
    durum: "guvende",
    metin: `${diffDays} gün kaldı`,
    badgeMetni: "Güvende",
  };
}

export default function BakimPage() {
  const isMounted = useIsMounted();
  const { record, saveRecord } = useMaintenanceRecord();

  // Local form state
  const [formData, setFormData] = useState<MaintenanceRecord>(record);
  const [kaydedildi, setKaydedildi] = useState(false);

  // Client-side today date (Never run during SSR)
  const bugun = isMounted ? new Date() : null;

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveRecord(formData);
    setKaydedildi(true);
    setTimeout(() => setKaydedildi(false), 2500);
  };

  // 1. Motor yağı bir sonraki değişim hedef tarihi (Son yağ tarihinden 1 yıl sonra)
  let sonrakiYagHedefTarihi = "";
  if (record.sonYagTarihi) {
    const d = new Date(record.sonYagTarihi);
    if (!isNaN(d.getTime())) {
      d.setFullYear(d.getFullYear() + 1);
      sonrakiYagHedefTarihi = d.toISOString().split("T")[0];
    }
  }

  const yagDurumu = hesaplaHedefTarihDurumu(sonrakiYagHedefTarihi, bugun, 30);
  const lastikDurumu = hesaplaHedefTarihDurumu(record.sonLastikTarihi, bugun, 30);
  const muayeneDurumu = hesaplaHedefTarihDurumu(record.muayeneTarihi, bugun, 45);
  const sigortaDurumu = hesaplaHedefTarihDurumu(record.sigortaTarihi, bugun, 30);

  // KM farkı hesabı
  const yagKmFarki = Math.max(0, record.guncelKm - (record.sonYagKm || 0));
  const yagKalanKm = 15000 - yagKmFarki;

  const getBadgeClass = (durum: ItemStatus["durum"]) => {
    switch (durum) {
      case "gecikmis":
        return "bg-rose-500/10 text-rose-500 border-rose-500/30";
      case "yaklasiyor":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "guvende":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      default:
        return "bg-surface-elevated text-muted border-border";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
            Kişisel Garaj Sağlığı
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-main tracking-tight mb-2">
            Periyodik Bakım Takvimi
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            Aracınızın motor yağı, lastik, muayene ve sigorta tarihlerini kaydedin; yaklaşan
            kritik servis sürelerini tek bakışta izleyin.
          </p>
        </div>

        {/* CTA: AI Bakım Planı Al */}
        <Link
          href="/asistan?tab=bakim"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all shadow-md shadow-primary/25 shrink-0 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          <span>AI&apos;dan Bakım Planı Al &rarr;</span>
        </Link>
      </div>

      {/* Main Grid: Status Cards & Edit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Status Dashboard: 4 Critical Maintenance Items */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-bold font-heading text-main mb-4 flex items-center justify-between">
            <span>Servis & Uyarı Durumu</span>
            {record.aracAdi && (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-surface-elevated text-primary font-bold border border-border">
                {record.aracAdi}
              </span>
            )}
          </h2>

          {/* 1. Motor Yağı & Filtresi */}
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${getBadgeClass(yagDurumu.durum)}`}>
                  {yagDurumu.badgeMetni}
                </span>
                <h3 className="font-heading font-bold text-base text-main">
                  Motor Yağı & Yağ Filtresi
                </h3>
              </div>
              <p className="text-xs text-muted">
                {record.sonYagTarihi
                  ? `Son Değişim: ${record.sonYagTarihi} (${record.sonYagKm.toLocaleString("tr-TR")} km)`
                  : "Son yağ değişim tarihi henüz girilmedi."}
              </p>
              {record.sonYagKm > 0 && record.guncelKm > 0 && (
                <p className="text-xs text-main font-medium">
                  Değişimden bu yana: <strong>{yagKmFarki.toLocaleString("tr-TR")} km</strong> yapıldı &bull;{" "}
                  {yagKalanKm > 0 ? (
                    <span className="text-emerald-500 font-semibold">{yagKalanKm.toLocaleString("tr-TR")} km kaldı</span>
                  ) : (
                    <span className="text-rose-500 font-semibold">{Math.abs(yagKalanKm).toLocaleString("tr-TR")} km aşıldı!</span>
                  )}
                </p>
              )}
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="block text-xs text-muted">Tarihsel Durum</span>
              <span className="font-heading font-bold text-base text-main">
                {yagDurumu.metin}
              </span>
            </div>
          </div>

          {/* 2. Lastik Değişimi & Kontrolü */}
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${getBadgeClass(lastikDurumu.durum)}`}>
                  {lastikDurumu.badgeMetni}
                </span>
                <h3 className="font-heading font-bold text-base text-main">
                  Lastik Değişimi & Diş Derinliği
                </h3>
              </div>
              <p className="text-xs text-muted">
                {record.sonLastikTarihi
                  ? `Hedef / Son Kontrol Tarihi: ${record.sonLastikTarihi}`
                  : "Mevsimlik lastik veya rotasyon tarihi belirtilmedi."}
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="block text-xs text-muted">Kalan Süre</span>
              <span className="font-heading font-bold text-base text-main">
                {lastikDurumu.metin}
              </span>
            </div>
          </div>

          {/* 3. TÜVTÜRK Muayene Tarihi */}
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${getBadgeClass(muayeneDurumu.durum)}`}>
                  {muayeneDurumu.badgeMetni}
                </span>
                <h3 className="font-heading font-bold text-base text-main">
                  TÜVTÜRK Araç Muayenesi
                </h3>
              </div>
              <p className="text-xs text-muted">
                {record.muayeneTarihi
                  ? `Muayene Bitiş Tarihi: ${record.muayeneTarihi}`
                  : "Ruhsattaki muayene geçerlilik süresi henüz girilmedi."}
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="block text-xs text-muted">Muayene Vadesi</span>
              <span className="font-heading font-bold text-base text-main">
                {muayeneDurumu.metin}
              </span>
            </div>
          </div>

          {/* 4. Sigorta & Kasko Bitiş Tarihi */}
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${getBadgeClass(sigortaDurumu.durum)}`}>
                  {sigortaDurumu.badgeMetni}
                </span>
                <h3 className="font-heading font-bold text-base text-main">
                  Trafik Sigortası & Kasko Poliçesi
                </h3>
              </div>
              <p className="text-xs text-muted">
                {record.sigortaTarihi
                  ? `Poliçe Bitiş Tarihi: ${record.sigortaTarihi}`
                  : "Zorunlu trafik sigortası veya kasko yenileme tarihi girilmedi."}
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="block text-xs text-muted">Poliçe Vadesi</span>
              <span className="font-heading font-bold text-base text-main">
                {sigortaDurumu.metin}
              </span>
            </div>
          </div>

          {/* Tips Box */}
          <div className="p-4 rounded-2xl bg-surface-elevated/60 border border-border text-xs text-muted space-y-1">
            <span className="font-bold text-main block">💡 Hatırlatma İpuçları:</span>
            <p>
              Periyodik bakım aralıkları genellikle <strong>1 yıl veya 15.000 km</strong>&apos;dir (hangisi önce dolarsa).
              TÜVTÜRK muayenesi gecikmelerinde aylık %5 gecikme cezası uygulanmaktadır.
            </p>
          </div>
        </div>

        {/* Input Form: Save Vehicle Data to LocalStorage */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-surface border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-heading text-main">
              Araç Bilgilerini Güncelle
            </h2>
            {kaydedildi && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/30 animate-in fade-in">
                ✓ Kaydedildi
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="aracAdi" className="block text-xs font-semibold text-main mb-1">
                Araç Tanımı / Model
              </label>
              <input
                id="aracAdi"
                name="aracAdi"
                type="text"
                value={formData.aracAdi}
                onChange={handleChange}
                placeholder="Örn: 2022 Toyota Corolla veya Şahsi SUV"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="guncelKm" className="block text-xs font-semibold text-main mb-1">
                  Güncel Kilometre
                </label>
                <input
                  id="guncelKm"
                  name="guncelKm"
                  type="number"
                  min="0"
                  step="500"
                  value={formData.guncelKm || ""}
                  onChange={handleChange}
                  placeholder="Örn: 45000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="sonYagKm" className="block text-xs font-semibold text-main mb-1">
                  Son Yağ Değişim KM
                </label>
                <input
                  id="sonYagKm"
                  name="sonYagKm"
                  type="number"
                  min="0"
                  step="500"
                  value={formData.sonYagKm || ""}
                  onChange={handleChange}
                  placeholder="Örn: 35000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="sonYagTarihi" className="block text-xs font-semibold text-main mb-1">
                Son Motor Yağı Değişim Tarihi
              </label>
              <input
                id="sonYagTarihi"
                name="sonYagTarihi"
                type="date"
                value={formData.sonYagTarihi}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="sonLastikTarihi" className="block text-xs font-semibold text-main mb-1">
                Lastik Değişimi / Gelecek Rotasyon Tarihi
              </label>
              <input
                id="sonLastikTarihi"
                name="sonLastikTarihi"
                type="date"
                value={formData.sonLastikTarihi}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="muayeneTarihi" className="block text-xs font-semibold text-main mb-1">
                TÜVTÜRK Muayene Bitiş Tarihi
              </label>
              <input
                id="muayeneTarihi"
                name="muayeneTarihi"
                type="date"
                value={formData.muayeneTarihi}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="sigortaTarihi" className="block text-xs font-semibold text-main mb-1">
                Sigorta / Kasko Bitiş Tarihi
              </label>
              <input
                id="sigortaTarihi"
                name="sigortaTarihi"
                type="date"
                value={formData.sigortaTarihi}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all shadow-md shadow-primary/25 mt-2"
            >
              Takvimi Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
