"use client";

import React, { useState, useMemo, useEffect } from "react";
import { carsData, type Car } from "@/data/cars";
import { filtreleAraclar, type AracSiralama } from "@/lib/filtrele";
import { CarCard } from "@/components/CarCard";
import { CompareFloatingBar } from "@/components/CompareFloatingBar";
import { useGarage } from "@/lib/storage";

export default function AraclarPage() {
  const { favorites } = useGarage();

  // Tabs: "tum" | "garajim"
  const [activeTab, setActiveTab] = useState<"tum" | "garajim">("tum");

  const floor = Math.min(...carsData.map((c) => c.fiyatMin));
  const ceiling = Math.max(...carsData.map((c) => c.fiyatMax));
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [bodies, setBodies] = useState<Car["kasaTipi"][]>([]);
  const [fuels, setFuels] = useState<Car["yakit"][]>([]);
  const [transmissions, setTransmissions] = useState<Car["vites"][]>([]);
  const [priceMin, setPriceMin] = useState(floor), [priceMax, setPriceMax] = useState(ceiling);
  const [sort, setSort] = useState<AracSiralama>("onerilen");
  const [panelOpen, setPanelOpen] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => setAppliedSearch(searchInput.trim()), 300); return () => window.clearTimeout(timer); }, [searchInput]);
  const brandsList = useMemo(() => Array.from(new Set(carsData.map((c) => c.marka))).sort(), []);
  const bodyList: {value: Car["kasaTipi"]; label: string}[] = [{value:"sedan",label:"Sedan"},{value:"hatchback",label:"Hatchback"},{value:"suv",label:"SUV"},{value:"elektrikli",label:"Elektrikli"},{value:"station-wagon",label:"Station Wagon"},{value:"pickup",label:"Pickup"}];
  const fuelList: {value: Car["yakit"];label:string}[] = [{value:"benzin",label:"Benzin"},{value:"dizel",label:"Dizel"},{value:"hibrit",label:"Hibrit"},{value:"elektrik",label:"Elektrik"}];
  const transmissionList: {value: Car["vites"];label:string}[] = [{value:"manuel",label:"Manuel"},{value:"otomatik",label:"Otomatik"}];
  const money = (n: number) => `${new Intl.NumberFormat("tr-TR").format(n)} \u20ba`;
  const toggle = <T extends string>(arr:T[],v:T,set:(v:T[])=>void) => set(arr.includes(v)?arr.filter(x=>x!==v):[...arr,v]);
  const handleResetFilters = () => { setSearchInput("");setAppliedSearch("");setBrands([]);setBodies([]);setFuels([]);setTransmissions([]);setPriceMin(floor);setPriceMax(ceiling);setSort("onerilen"); };
  const sourceList = activeTab === "garajim" ? carsData.filter(c=>favorites.includes(c.id)) : carsData;
  const filteredCars = useMemo(() => filtreleAraclar(sourceList,{arama:appliedSearch,markalar:brands,kasaTipleri:bodies,yakitTipleri:fuels,vitesTipleri:transmissions,fiyatMin:priceMin,fiyatMax:priceMax,siralama:sort}),[sourceList,appliedSearch,brands,bodies,fuels,transmissions,priceMin,priceMax,sort]);
  const activeCount=brands.length+bodies.length+fuels.length+transmissions.length+(appliedSearch?1:0)+(priceMin!==floor||priceMax!==ceiling?1:0);
  const hasActiveFilters=activeCount>0;
  const chip=(on:boolean)=>"px-3 py-1.5 rounded-full border text-xs font-semibold "+(on?"bg-primary text-white border-primary":"bg-surface-elevated text-main border-border hover:border-primary");

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

      <section className="p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-sm mb-6" aria-label="Ara&#231; filtreleri">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button type="button" onClick={()=>setPanelOpen(!panelOpen)} aria-expanded={panelOpen} className="md:hidden px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm">Filtreler ({activeCount})</button>
          <div className="relative min-w-[min(100%,280px)] flex-1"><input type="search" value={searchInput} onChange={e=>setSearchInput(e.target.value)} placeholder="Marka veya model ara (&#246;rn. Corolla, Togg)..." aria-label="Marka veya model ara" className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"/>
          {searchInput&&<button type="button" onClick={()=>setSearchInput("")} aria-label="Arama kutusunu temizle" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-lg">×</button>}</div>
          <label className="text-sm text-muted flex items-center gap-2">Sıralama<select value={sort} onChange={e=>setSort(e.target.value as AracSiralama)} className="px-3 py-2.5 rounded-xl bg-surface-elevated border border-border text-sm text-main"><option value="onerilen">Önerilen</option><option value="fiyat-artan">Fiyat (artan)</option><option value="fiyat-azalan">Fiyat (azalan)</option><option value="motor-gucu">Motor gücü</option><option value="tuketim">Yakıt tüketimi</option></select></label>
        </div>
        <div className={(panelOpen?"block":"hidden")+" md:block"}><div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[
            {label:"Marka",values:brandsList,selected:brands,toggle:(v:string)=>toggle(brands,v,setBrands)},
            {label:"Kasa tipi",values:bodyList.map(x=>x.value),selected:bodies,toggle:(v:string)=>toggle(bodies,v as Car["kasaTipi"],setBodies)},
            {label:"Yakıt türü",values:fuelList.map(x=>x.value),selected:fuels,toggle:(v:string)=>toggle(fuels,v as Car["yakit"],setFuels)},
            {label:"Vites",values:transmissionList.map(x=>x.value),selected:transmissions,toggle:(v:string)=>toggle(transmissions,v as Car["vites"],setTransmissions)}
          ].map(g=><fieldset key={g.label}><legend className="text-xs font-bold text-muted mb-2">{g.label}</legend><div className="flex flex-wrap gap-2">{g.values.map(v=>{const label=[...bodyList,...fuelList,...transmissionList].find(x=>x.value===v)?.label??v;const chosen=(g.selected as string[]).includes(v);return <button type="button" key={v} aria-pressed={chosen} onClick={()=>g.toggle(v)} className={chip(chosen)}>{label}</button>})}</div></fieldset>)}
        </div>
        <fieldset className="mt-5 pt-4 border-t border-border"><legend className="text-xs font-bold text-muted mb-2">Fiyat aralığı</legend><div className="flex justify-between text-sm font-semibold text-main mb-2"><span>{money(priceMin)}</span><span>{money(priceMax)}</span></div><div className="grid sm:grid-cols-2 gap-4">
          <label className="text-xs text-muted">En düşük fiyat<input type="range" min={floor} max={ceiling} step={50000} value={priceMin} onChange={e=>setPriceMin(Math.min(+e.target.value,priceMax))} aria-label="En düşük fiyat" className="block w-full accent-[var(--color-primary)]"/></label>
          <label className="text-xs text-muted">En yüksek fiyat<input type="range" min={floor} max={ceiling} step={50000} value={priceMax} onChange={e=>setPriceMax(Math.max(+e.target.value,priceMin))} aria-label="En yüksek fiyat" className="block w-full accent-[var(--color-primary)]"/></label>
        </div></fieldset></div>
        {hasActiveFilters&&<div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center gap-2 text-xs"><span className="text-muted font-semibold">Aktif filtreler:</span>
          {appliedSearch&&<button onClick={()=>setSearchInput("")} className={chip(true)}>Arama: “{appliedSearch}” ×</button>}
          {brands.map(v=><button key={v} onClick={()=>setBrands(brands.filter(x=>x!==v))} className={chip(true)}>Marka: {v} ×</button>)}
          {bodies.map(v=><button key={v} onClick={()=>setBodies(bodies.filter(x=>x!==v))} className={chip(true)}>Kasa: {v} ×</button>)}
          {fuels.map(v=><button key={v} onClick={()=>setFuels(fuels.filter(x=>x!==v))} className={chip(true)}>Yakıt: {v} ×</button>)}
          {transmissions.map(v=><button key={v} onClick={()=>setTransmissions(transmissions.filter(x=>x!==v))} className={chip(true)}>Vites: {v} ×</button>)}
          {(priceMin!==floor||priceMax!==ceiling)&&<button onClick={()=>{setPriceMin(floor);setPriceMax(ceiling)}} className={chip(true)}>Fiyat: {money(priceMin)}–{money(priceMax)} ×</button>}
          <button type="button" onClick={handleResetFilters} className="ml-auto font-semibold text-primary hover:underline">Tüm filtreleri temizle</button>
        </div>}
      </section>
      <div className="mb-4 text-xs font-semibold text-muted" aria-live="polite">{filteredCars.length} araç bulundu</div>

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
