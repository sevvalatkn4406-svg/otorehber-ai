"use client";

import React, { useState, useMemo } from "react";
import { carsData, KasaTipi } from "@/data/cars";
import { CarCard } from "@/components/CarCard";
import { CompareFloatingBar } from "@/components/CompareFloatingBar";
import { useGarage } from "@/lib/storage";

export default function AraclarPage() {
  const { favorites } = useGarage();

  // Tabs: "tum" | "garajim"
  const [activeTab, setActiveTab] = useState<"tum" | "garajim">("tum");

  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedMarka, setSelectedMarka] = useState<string>("all");
  const [selectedKasa, setSelectedKasa] = useState<string>("all");

  // Unique brands list
  const markalar = useMemo(() => {
    const set = new Set(carsData.map((c) => c.marka));
    return Array.from(set).sort();
  }, []);

  // Unique body types
  const kasaTipleri: { value: KasaTipi | "all"; label: string }[] = [
    { value: "all", label: "Tüm Kasa Tipleri" },
    { value: "sedan", label: "Sedan" },
    { value: "hatchback", label: "Hatchback" },
    { value: "suv", label: "SUV" },
    { value: "elektrikli", label: "Elektrikli" },
    { value: "station-wagon", label: "Station Wagon" },
    { value: "pickup", label: "Pickup" },
  ];

  // Handle Search Submission (Only filters when "Ara" button or Enter is pressed)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchInput.trim().toLowerCase());
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setAppliedSearch("");
    setSelectedMarka("all");
    setSelectedKasa("all");
  };

  // Filtered cars
  const filteredCars = useMemo(() => {
    const sourceList =
      activeTab === "garajim"
        ? carsData.filter((c) => favorites.includes(c.id))
        : carsData;

    return sourceList.filter((car) => {
      // 1. Text search (marka / model)
      if (appliedSearch) {
        const fullTitle = `${car.marka} ${car.model}`.toLowerCase();
        if (!fullTitle.includes(appliedSearch)) return false;
      }

      // 2. Marka filter
      if (selectedMarka !== "all" && car.marka !== selectedMarka) {
        return false;
      }

      // 3. Kasa tipi filter
      if (selectedKasa !== "all" && car.kasaTipi !== selectedKasa) {
        return false;
      }

      return true;
    });
  }, [activeTab, favorites, appliedSearch, selectedMarka, selectedKasa]);

  const hasActiveFilters =
    appliedSearch !== "" || selectedMarka !== "all" || selectedKasa !== "all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28">
      {/* Page Header */}
      <div className="max-w-3xl mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
          Araç Kataloğu & Garajım
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-main tracking-tight mb-3">
          Araç Keşif Paneli
        </h1>
        <p className="text-sm sm:text-base text-muted leading-relaxed">
          Segment, yakıt ve donanım özelliklerine göre güncel araçları filtreleyin,
          garajınıza ekleyin veya yan yana karşılaştırın.
        </p>
      </div>

      {/* Tabs: Tüm Araçlar vs Garajım */}
      <div className="flex items-center gap-2 border-b border-border mb-8 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("tum")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading text-sm font-bold transition-all ${
            activeTab === "tum"
              ? "bg-primary text-white shadow-sm"
              : "text-muted hover:text-main hover:bg-surface-elevated"
          }`}
        >
          <span>Tüm Araçlar</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === "tum"
                ? "bg-white/20 text-white"
                : "bg-surface-elevated text-muted"
            }`}
          >
            {carsData.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("garajim")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading text-sm font-bold transition-all ${
            activeTab === "garajim"
              ? "bg-primary text-white shadow-sm"
              : "text-muted hover:text-main hover:bg-surface-elevated"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill={activeTab === "garajim" ? "currentColor" : "none"}
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
          <span>Garajım</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              activeTab === "garajim"
                ? "bg-white/20 text-white"
                : "bg-surface-elevated text-muted"
            }`}
          >
            {favorites.length}
          </span>
        </button>
      </div>

      {/* Filter Bar (Text search + Ara button, Marka select, Kasa tipi select) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-sm mb-8">
        <form
          onSubmit={handleSearchSubmit}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3.5"
        >
          {/* Text search input & button */}
          <div className="sm:col-span-6 flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Marka veya model ara (örn. Corolla, Togg, SUV)..."
                className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-main text-sm"
                  aria-label="Arama kutusunu temizle"
                >
                  &times;
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-colors shrink-0 shadow-sm"
            >
              Ara
            </button>
          </div>

          {/* Marka Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedMarka}
              onChange={(e) => setSelectedMarka(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Marka Seçimi"
            >
              <option value="all">Tüm Markalar</option>
              {markalar.map((marka) => (
                <option key={marka} value={marka}>
                  {marka}
                </option>
              ))}
            </select>
          </div>

          {/* Kasa Tipi Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedKasa}
              onChange={(e) => setSelectedKasa(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Kasa Tipi Seçimi"
            >
              {kasaTipleri.map((kasa) => (
                <option key={kasa.value} value={kasa.value}>
                  {kasa.label}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Active Filter Info & Reset Button */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
            <div className="flex flex-wrap items-center gap-1.5">
              <span>Aktif Filtreler:</span>
              {appliedSearch && (
                <span className="px-2 py-0.5 rounded bg-surface-elevated text-main font-medium">
                  Metin: &ldquo;{appliedSearch}&rdquo;
                </span>
              )}
              {selectedMarka !== "all" && (
                <span className="px-2 py-0.5 rounded bg-surface-elevated text-main font-medium">
                  Marka: {selectedMarka}
                </span>
              )}
              {selectedKasa !== "all" && (
                <span className="px-2 py-0.5 rounded bg-surface-elevated text-main font-medium capitalize">
                  Kasa: {selectedKasa}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="font-semibold text-primary hover:underline ml-auto"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-xs font-semibold text-muted">
        Gösterilen: <span className="text-main font-bold">{filteredCars.length}</span> araç
      </div>

      {/* Main Content: Vehicle Cards Grid or Empty State */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : activeTab === "garajim" && favorites.length === 0 ? (
        /* Empty State: Garage is Empty */
        <div className="text-center py-16 px-4 rounded-3xl bg-surface border border-border">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
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
          </div>
          <h2 className="text-xl font-bold font-heading text-main mb-2">
            Garajınız Henüz Boş
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto mb-6 leading-relaxed">
            İlgilendiğiniz araç kartlarının sağ üst köşesindeki kalp ikonuna
            tıklayarak araçları garajınıza ekleyebilir, teknik verilerini ve tahmini
            maliyetlerini kolayca takip edebilirsiniz.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveTab("tum");
              handleResetFilters();
            }}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-colors shadow-sm"
          >
            Tüm Araçları Keşfet
          </button>
        </div>
      ) : (
        /* Empty State: Filter Returned No Results */
        <div className="text-center py-16 px-4 rounded-3xl bg-surface border border-border">
          <div className="w-14 h-14 rounded-2xl bg-surface-elevated text-muted flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold font-heading text-main mb-2">
            Kriterlerinize Uygun Araç Bulunamadı
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto mb-6 leading-relaxed">
            Arama terimini değiştirebilir veya seçtiğiniz marka / kasa tipi filtrelerini
            sıfırlayarak tüm araçları yeniden görüntüleyebilirsiniz.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-surface-elevated hover:bg-border text-main font-semibold text-sm transition-colors border border-border"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}

      {/* Floating Compare Bottom Bar */}
      <CompareFloatingBar />
    </div>
  );
}
