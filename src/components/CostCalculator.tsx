"use client";

import React, { useState } from "react";
import { Car } from "@/data/cars";
import {
  hesaplaYillikMaliyet,
  formatPrice,
  MALIYET_VARSAYIMLARI,
} from "@/lib/maliyet";

interface CostCalculatorProps {
  car: Car;
}

const KM_PRESETS = [10000, 15000, 20000, 30000];

export function CostCalculator({ car }: CostCalculatorProps) {
  const [km, setKm] = useState<number>(MALIYET_VARSAYIMLARI.varsayilanYillikKm);

  const maliyet = hesaplaYillikMaliyet(car, km);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
            Kullanım Ekonomisi
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-main">
            Tahmini Yıllık Kullanım Maliyeti
          </h3>
        </div>
        <div className="text-right">
          <span className="block text-xs text-muted">Tahmini Toplam / Yıl</span>
          <span className="text-2xl font-black font-heading text-primary">
            {formatPrice(maliyet.toplamYillikMaliyet)}
          </span>
        </div>
      </div>

      {/* KM Input & Presets */}
      <div className="p-4 rounded-2xl bg-surface-elevated/60 border border-border mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <label htmlFor="km-input" className="text-sm font-semibold text-main">
            Yıllık Ortalama Kilometre:
          </label>
          <div className="flex items-center gap-2">
            <input
              id="km-input"
              type="number"
              min="1000"
              max="100000"
              step="1000"
              value={km}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) setKm(Math.max(1000, val));
              }}
              className="w-32 px-3 py-1.5 rounded-xl bg-surface border border-border text-right font-bold text-main focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <span className="text-xs text-muted font-medium">km / yıl</span>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted mr-1">Hızlı Seçim:</span>
          {KM_PRESETS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setKm(val)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                km === val
                  ? "bg-primary text-white"
                  : "bg-surface hover:bg-border text-muted hover:text-main border border-border"
              }`}
            >
              {val.toLocaleString("tr-TR")} km
            </button>
          ))}
        </div>
      </div>

      {/* Breakdown Grid (Yakıt, Bakım, Sigorta) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Yakıt / Enerji */}
        <div className="p-4 rounded-2xl bg-surface-elevated border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-primary uppercase">
                {car.yakit === "elektrik" ? "Elektrik Tüketimi" : "Yakıt Tüketimi"}
              </span>
              <span className="text-[11px] text-muted">
                {maliyet.yakitBirimFiyati.toFixed(2)} ₺ / {car.yakit === "elektrik" ? "kWh" : "L"}
              </span>
            </div>
            <p className="text-xs text-muted mb-2">
              Yılda yaklaşık{" "}
              <span className="font-semibold text-main">
                {Math.round(maliyet.yillikTuketimMiktari).toLocaleString("tr-TR")} {car.yakit === "elektrik" ? "kWh" : "litre"}
              </span>
            </p>
          </div>
          <div className="pt-3 border-t border-border/80">
            <span className="block text-lg font-bold font-heading text-main">
              {formatPrice(maliyet.yakitMaliyeti)}
            </span>
            <span className="text-[11px] text-muted">Yıllık Enerji Gideri</span>
          </div>
        </div>

        {/* Tahmini Periyodik Bakım */}
        <div className="p-4 rounded-2xl bg-surface-elevated border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-500 uppercase">
                Periyodik Bakım
              </span>
              <span className="text-[11px] text-muted">Yıllık Servis</span>
            </div>
            <p className="text-xs text-muted mb-2">
              {car.yakit === "elektrik"
                ? "Filtre, fren, rot/balans ve batarya sağlığı kontrolü"
                : "Yağ, filtre seti, buji/enjektör ve fren kontrolü"}
            </p>
          </div>
          <div className="pt-3 border-t border-border/80">
            <span className="block text-lg font-bold font-heading text-main">
              {formatPrice(maliyet.bakimMaliyeti)}
            </span>
            <span className="text-[11px] text-muted">Tahmini Bakım Masrafı</span>
          </div>
        </div>

        {/* Sigorta & Kasko */}
        <div className="p-4 rounded-2xl bg-surface-elevated border border-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-500 uppercase">
                Kasko & Sigorta
              </span>
              <span className="text-[11px] text-muted">Yıllık Poliçe</span>
            </div>
            <p className="text-xs text-muted mb-2">
              Zorunlu Trafik Sigortası ve ortalama kasko paketi tahmini
            </p>
          </div>
          <div className="pt-3 border-t border-border/80">
            <span className="block text-lg font-bold font-heading text-main">
              {formatPrice(maliyet.sigortaMaliyeti)}
            </span>
            <span className="text-[11px] text-muted">Tahmini Sigorta Masrafı</span>
          </div>
        </div>
      </div>

      {/* Monthly & Per-KM Summary */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-elevated/40 border border-border mb-6 text-center sm:text-left">
        <div>
          <span className="block text-xs text-muted">Ortalama Aylık Yürütme Masrafı:</span>
          <span className="font-heading font-bold text-base sm:text-lg text-main">
            {formatPrice(maliyet.aylikOrtalamaMaliyet)} / ay
          </span>
        </div>
        <div>
          <span className="block text-xs text-muted">Kilometre Başına Maliyet:</span>
          <span className="font-heading font-bold text-base sm:text-lg text-main">
            {maliyet.kmBasiMaliyet.toFixed(2)} ₺ / km
          </span>
        </div>
      </div>

      {/* Transparent Assumptions (Varsayımlar) */}
      <div className="p-4 rounded-2xl bg-surface-elevated/30 border border-border/70 text-xs text-muted space-y-1.5">
        <span className="font-semibold text-main block">
          Hesaplama Varsayımları & Metodoloji:
        </span>
        <ul className="list-disc list-inside space-y-0.5 leading-relaxed">
          <li>
            Benzin birim fiyatı:{" "}
            <span className="font-medium text-main">
              {MALIYET_VARSAYIMLARI.benzinLitreFiyati.toFixed(2)} ₺/L
            </span>
            , Motorin (dizel):{" "}
            <span className="font-medium text-main">
              {MALIYET_VARSAYIMLARI.dizelLitreFiyati.toFixed(2)} ₺/L
            </span>
            , Elektrik:{" "}
            <span className="font-medium text-main">
              {MALIYET_VARSAYIMLARI.elektrikKwhFiyati.toFixed(2)} ₺/kWh
            </span>
            .
          </li>
          <li>
            Tüketim hesabı, fabrikanın karma tüketim verisi ({car.ortalamaTuketim}{" "}
            {maliyet.yakitTuketimBirimi}) temel alınarak yapılmıştır.
          </li>
          <li>
            Sigorta ve kasko değerleri araç segmentine ve tahmini piyasa değerine göre
            modellenmiştir; kullanıcı hasarsızlık kademesine göre değişebilir.
          </li>
        </ul>
      </div>
    </div>
  );
}
