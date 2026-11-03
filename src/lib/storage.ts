"use client";

import { useSyncExternalStore } from "react";

// Modül seviyesinde tanımlı sabit boş dizi (referans eşitliği için)
const EMPTY_ARRAY: string[] = [];

// ==========================================
// 1. FAVORITES (GARAJIM) STORE
// ==========================================
const FAVORITES_KEY = "otorehber_garage_favorites";

let favoritesListeners: Array<() => void> = [];
let cachedFavoritesRaw: string | null = null;
let cachedFavoritesParsed: string[] = EMPTY_ARRAY;

function emitFavoritesChange() {
  for (const listener of favoritesListeners) {
    listener();
  }
}

function subscribeFavorites(callback: () => void) {
  favoritesListeners.push(callback);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === FAVORITES_KEY) {
      emitFavoritesChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => {
    favoritesListeners = favoritesListeners.filter((l) => l !== callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function getFavoritesSnapshot(): string[] {
  if (typeof window === "undefined") {
    return EMPTY_ARRAY;
  }

  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    // Ham string değişmediyse AYNI dizi referansını döndür
    if (raw === cachedFavoritesRaw) {
      return cachedFavoritesParsed;
    }

    cachedFavoritesRaw = raw;
    if (!raw) {
      cachedFavoritesParsed = EMPTY_ARRAY;
    } else {
      const parsed = JSON.parse(raw);
      cachedFavoritesParsed = Array.isArray(parsed) ? parsed : EMPTY_ARRAY;
    }
    return cachedFavoritesParsed;
  } catch {
    cachedFavoritesRaw = null;
    cachedFavoritesParsed = EMPTY_ARRAY;
    return cachedFavoritesParsed;
  }
}

function getFavoritesServerSnapshot(): string[] {
  return EMPTY_ARRAY;
}

export function useGarage() {
  const favorites = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getFavoritesServerSnapshot
  );

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = (id: string) => {
    try {
      const current = getFavoritesSnapshot();
      let updated: string[];
      if (current.includes(id)) {
        updated = current.filter((item) => item !== id);
      } else {
        updated = [...current, id];
      }
      const raw = JSON.stringify(updated);
      localStorage.setItem(FAVORITES_KEY, raw);
      // Önbelleği güncelle ve abonelere bildir
      cachedFavoritesRaw = raw;
      cachedFavoritesParsed = updated;
      emitFavoritesChange();
    } catch {}
  };

  return { favorites, isFavorite, toggleFavorite };
}

// ==========================================
// 2. COMPARE LIST STORE (MAX 3)
// ==========================================
const COMPARE_KEY = "otorehber_compare_cars";

let compareListeners: Array<() => void> = [];
let cachedCompareRaw: string | null = null;
let cachedCompareParsed: string[] = EMPTY_ARRAY;

function emitCompareChange() {
  for (const listener of compareListeners) {
    listener();
  }
}

function subscribeCompare(callback: () => void) {
  compareListeners.push(callback);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === COMPARE_KEY) {
      emitCompareChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => {
    compareListeners = compareListeners.filter((l) => l !== callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function getCompareSnapshot(): string[] {
  if (typeof window === "undefined") {
    return EMPTY_ARRAY;
  }

  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    // Ham string değişmediyse AYNI dizi referansını döndür
    if (raw === cachedCompareRaw) {
      return cachedCompareParsed;
    }

    cachedCompareRaw = raw;
    if (!raw) {
      cachedCompareParsed = EMPTY_ARRAY;
    } else {
      const parsed = JSON.parse(raw);
      cachedCompareParsed = Array.isArray(parsed) ? parsed : EMPTY_ARRAY;
    }
    return cachedCompareParsed;
  } catch {
    cachedCompareRaw = null;
    cachedCompareParsed = EMPTY_ARRAY;
    return cachedCompareParsed;
  }
}

function getCompareServerSnapshot(): string[] {
  return EMPTY_ARRAY;
}

export function useCompare() {
  const compareList = useSyncExternalStore(
    subscribeCompare,
    getCompareSnapshot,
    getCompareServerSnapshot
  );

  const isCompared = (id: string) => compareList.includes(id);

  const addToCompare = (id: string): { success: boolean; message?: string } => {
    const current = getCompareSnapshot();
    if (current.includes(id)) {
      return { success: true };
    }
    if (current.length >= 3) {
      return {
        success: false,
        message: "En fazla 3 araç karşılaştırabilirsiniz. Lütfen önce bir aracı çıkarın.",
      };
    }
    const updated = [...current, id];
    try {
      const raw = JSON.stringify(updated);
      localStorage.setItem(COMPARE_KEY, raw);
      cachedCompareRaw = raw;
      cachedCompareParsed = updated;
      emitCompareChange();
    } catch {}
    return { success: true };
  };

  const removeFromCompare = (id: string) => {
    const current = getCompareSnapshot();
    const updated = current.filter((item) => item !== id);
    try {
      const raw = JSON.stringify(updated);
      localStorage.setItem(COMPARE_KEY, raw);
      cachedCompareRaw = raw;
      cachedCompareParsed = updated;
      emitCompareChange();
    } catch {}
  };

  const clearCompare = () => {
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify([]));
      cachedCompareRaw = "[]";
      cachedCompareParsed = EMPTY_ARRAY;
      emitCompareChange();
    } catch {}
  };

  const toggleCompare = (id: string): { success: boolean; message?: string } => {
    if (isCompared(id)) {
      removeFromCompare(id);
      return { success: true };
    }
    return addToCompare(id);
  };

  return {
    compareList,
    isCompared,
    addToCompare,
    removeFromCompare,
    clearCompare,
    toggleCompare,
  };
}
