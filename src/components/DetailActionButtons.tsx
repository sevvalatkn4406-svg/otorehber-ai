"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGarage, useCompare } from "@/lib/storage";

interface DetailActionButtonsProps {
  carId: string;
}

export function DetailActionButtons({ carId }: DetailActionButtonsProps) {
  const { isFavorite, toggleFavorite } = useGarage();
  const { isCompared, toggleCompare } = useCompare();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const favorited = isFavorite(carId);
  const compared = isCompared(carId);

  const handleCompareClick = () => {
    const res = toggleCompare(carId);
    if (!res.success && res.message) {
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <div className="relative flex flex-wrap items-center gap-3">
      {/* Toast Warning */}
      {toastMessage && (
        <div className="absolute -top-12 left-0 right-0 z-20 bg-rose-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg text-center font-medium animate-in fade-in duration-200">
          {toastMessage}
        </div>
      )}

      {/* Favorite (Garaj) Toggle */}
      <button
        type="button"
        onClick={() => toggleFavorite(carId)}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
          favorited
            ? "bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20"
            : "bg-surface border-border text-muted hover:text-main hover:bg-surface-elevated"
        }`}
      >
        <svg
          className="w-4 h-4"
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
        <span>{favorited ? "Garajımda" : "Garajıma Ekle"}</span>
      </button>

      {/* Compare Toggle */}
      <button
        type="button"
        onClick={handleCompareClick}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
          compared
            ? "bg-primary text-white border-primary shadow-sm"
            : "bg-surface border-border text-muted hover:text-main hover:bg-surface-elevated"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
          />
        </svg>
        <span>{compared ? "Karşılaştırmada" : "Karşılaştırmaya Ekle"}</span>
      </button>

      {compared && (
        <Link
          href="/karsilastir"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline ml-1"
        >
          Kıyaslama Sayfasına Git &rarr;
        </Link>
      )}
    </div>
  );
}
