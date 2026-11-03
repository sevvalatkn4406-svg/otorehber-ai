"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Car } from "@/data/cars";
import { CarIcon } from "./CarIcon";
import { formatPrice } from "@/lib/maliyet";
import { useGarage, useCompare } from "@/lib/storage";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const { isFavorite, toggleFavorite } = useGarage();
  const { isCompared, toggleCompare } = useCompare();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const favorited = isFavorite(car.id);
  const compared = isCompared(car.id);

  const handleCompareClick = () => {
    const res = toggleCompare(car.id);
    if (!res.success && res.message) {
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <div className="relative rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all p-5 flex flex-col justify-between shadow-sm hover:shadow-md group">
      {/* Toast Warning for Max 3 Cars */}
      {toastMessage && (
        <div className="absolute top-2 left-2 right-2 z-20 bg-rose-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg text-center font-medium animate-in fade-in duration-200">
          {toastMessage}
        </div>
      )}

      <div>
        {/* Top Bar: Brand, Year, and Favorite Heart Button */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-primary">
              {car.marka}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-muted font-medium">
              {car.yil}
            </span>
          </div>

          <button
            type="button"
            onClick={() => toggleFavorite(car.id)}
            aria-label={favorited ? "Garajımdan Çıkar" : "Garajıma Ekle"}
            title={favorited ? "Garajımdan Çıkar" : "Garajıma Ekle"}
            className={`p-2 rounded-xl transition-all ${
              favorited
                ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                : "bg-surface-elevated text-muted hover:text-rose-500 hover:bg-rose-500/10"
            }`}
          >
            <svg
              className="w-5 h-5 transition-transform active:scale-125"
              fill={favorited ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        </div>

        {/* Car Silhouette Area */}
        <Link
          href={`/araclar/${car.id}`}
          className="block h-36 flex items-center justify-center p-3 mb-4 bg-surface-elevated/40 rounded-xl group-hover:bg-surface-elevated/70 transition-colors"
        >
          <CarIcon
            kasaTipi={car.kasaTipi}
            className="w-52 h-auto transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Model Title */}
        <Link href={`/araclar/${car.id}`} className="block group-hover:text-primary transition-colors">
          <h2 className="text-lg font-bold font-heading text-main tracking-tight line-clamp-1 mb-2">
            {car.model}
          </h2>
        </Link>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted mb-4">
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-surface-elevated/50">
            <span className="font-semibold text-main capitalize">{car.kasaTipi}</span>
          </div>
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-surface-elevated/50">
            <span className="font-semibold text-main capitalize">{car.yakit}</span>
          </div>
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-surface-elevated/50">
            <span>Güç:</span>
            <span className="font-semibold text-main">{car.motorGucuHp} HP</span>
          </div>
          <div className="flex items-center gap-1.5 p-1.5 rounded bg-surface-elevated/50">
            <span>Tüketim:</span>
            <span className="font-semibold text-main">
              {car.ortalamaTuketim} {car.yakit === "elektrik" ? "kWh" : "L"}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Area: Price Range & Actions */}
      <div>
        <div className="pt-3 border-t border-border mb-3">
          <span className="block text-[11px] text-muted">Tahmini Fiyat Aralığı</span>
          <span className="font-heading font-bold text-sm text-main">
            {formatPrice(car.fiyatMin)} - {formatPrice(car.fiyatMax)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/araclar/${car.id}`}
            className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-surface-elevated hover:bg-border text-main font-semibold text-xs transition-colors border border-border"
          >
            Detay İncele
          </Link>

          <button
            type="button"
            onClick={handleCompareClick}
            className={`inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl font-semibold text-xs transition-all ${
              compared
                ? "bg-primary text-white shadow-sm"
                : "bg-surface-elevated hover:bg-primary/10 text-muted hover:text-primary border border-border"
            }`}
          >
            {compared ? (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Seçildi
              </>
            ) : (
              "+ Kıyasla"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
