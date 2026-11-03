"use client";

import React from "react";
import Link from "next/link";
import { useCompare } from "@/lib/storage";
import { carsData } from "@/data/cars";

export function CompareFloatingBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  const selectedCars = carsData.filter((c) => compareList.includes(c.id));

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-4xl mx-auto animate-in slide-in-from-bottom-5 duration-200">
      <div className="p-3 sm:p-4 rounded-2xl bg-surface/95 backdrop-blur-md border border-primary/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Info & Chips */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs">
            <span>{selectedCars.length}/3</span>
            <span>Araç Seçildi</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {selectedCars.map((car) => (
              <span
                key={car.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-xs font-medium text-main"
              >
                <span className="truncate max-w-[120px] sm:max-w-[160px]">
                  {car.marka} {car.model}
                </span>
                <button
                  type="button"
                  onClick={() => removeFromCompare(car.id)}
                  aria-label={`${car.marka} ${car.model} karşılaştırmadan çıkar`}
                  className="text-muted hover:text-rose-500 transition-colors ml-0.5"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={clearCompare}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            Temizle
          </button>

          <Link
            href="/karsilastir"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-xs transition-all shadow-md shadow-primary/25"
          >
            <span>Karşılaştır ({selectedCars.length})</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
