"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";

const CATEGORIES = [
  { label: "Semua Kategori", value: "all" },
  { label: "iPhone", value: "iphone" },
  { label: "Aksesoris", value: "accessories" },
  { label: "Deals & Promo", value: "deals" },
];

const SERIES_LIST = [
  { label: "Semua Seri", value: "all" },
  { label: "iPhone 16 Series", value: "16" },
  { label: "iPhone 15 Series", value: "15" },
  { label: "iPhone 14 Series", value: "14" },
  { label: "iPhone 13 Series", value: "13" },
];

const STORAGES = [
  { label: "Semua Kapasitas", value: "all" },
  { label: "128GB", value: "128GB" },
  { label: "256GB", value: "256GB" },
  { label: "512GB", value: "512GB" },
  { label: "1TB", value: "1TB" },
];

const CONDITIONS = [
  { label: "Semua Kondisi", value: "all" },
  { label: "Baru Segel Resmi (NEW)", value: "NEW" },
  { label: "Like New / Second (Mulus)", value: "SECOND" },
];

const SORTS = [
  { label: "Rekomendasi Utama", value: "default" },
  { label: "Harga: Termurah ke Termahal", value: "price_asc" },
  { label: "Harga: Termahal ke Termurah", value: "price_desc" },
  { label: "Rilis Terbaru", value: "newest" },
];

/**
 * ProductFilters — Responsive Sidebar & Quick Filter bar for Catalog.
 */
export default function ProductFilters({ initialParams = {}, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || initialParams.search || "");

  // Current active values
  const currentCategory = searchParams.get("category") || initialParams.category || "all";
  const currentSeries = searchParams.get("series") || initialParams.series || "all";
  const currentStorage = searchParams.get("storage") || initialParams.storage || "all";
  const currentCondition = searchParams.get("condition") || initialParams.condition || "all";
  const currentSort = searchParams.get("sort") || initialParams.sort || "default";
  const currentSearch = searchParams.get("search") || initialParams.search || "";

  // Check how many filters are active
  const activeFilterCount = [
    currentCategory !== "all",
    currentSeries !== "all",
    currentStorage !== "all",
    currentCondition !== "all",
    currentSort !== "default",
    Boolean(currentSearch.trim()),
  ].filter(Boolean).length;

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all" || (key === "sort" && value === "default")) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("search", searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateParam("search", "");
  };

  const handleResetAll = () => {
    setSearchInput("");
    setIsMobileOpen(false);
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const filterContent = (
    <div className="space-y-6 text-sm">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-[#171717] text-sm">Filter Produk</span>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#171717] text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={handleResetAll}
            className="text-xs font-semibold text-[#DC2626] hover:underline transition-colors"
          >
            Reset Semua
          </button>
        )}
      </div>

      {/* 1. Kategori */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#737373] mb-2">
          Kategori
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = currentCategory.toLowerCase() === cat.value.toLowerCase();
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => updateParam("category", cat.value)}
                className={clsx(
                  "w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between",
                  isSelected
                    ? "bg-[#171717] text-white font-semibold"
                    : "text-[#171717] hover:bg-[#F7F7F8]"
                )}
              >
                <span>{cat.label}</span>
                {isSelected && <span className="text-white text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Seri iPhone */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#737373] mb-2">
          Seri iPhone
        </label>
        <div className="space-y-1">
          {SERIES_LIST.map((item) => {
            const isSelected = currentSeries.toLowerCase() === item.value.toLowerCase();
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => updateParam("series", item.value)}
                className={clsx(
                  "w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between",
                  isSelected
                    ? "bg-[#171717] text-white font-semibold"
                    : "text-[#171717] hover:bg-[#F7F7F8]"
                )}
              >
                <span>{item.label}</span>
                {isSelected && <span className="text-white text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Kapasitas Memori */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#737373] mb-2">
          Kapasitas Memori
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {STORAGES.map((st) => {
            const isSelected = currentStorage.toLowerCase() === st.value.toLowerCase();
            return (
              <button
                key={st.value}
                type="button"
                onClick={() => updateParam("storage", st.value)}
                className={clsx(
                  "px-2.5 py-2 rounded-xl text-xs font-medium text-center transition-all border",
                  isSelected
                    ? "bg-[#171717] text-white font-semibold border-[#171717]"
                    : "bg-white text-[#171717] border-[#E5E5E5] hover:border-[#171717]/40"
                )}
              >
                {st.value === "all" ? "Semua" : st.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Kondisi Unit */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#737373] mb-2">
          Kondisi Unit
        </label>
        <div className="space-y-1">
          {CONDITIONS.map((cond) => {
            const isSelected = currentCondition.toUpperCase() === cond.value.toUpperCase();
            return (
              <button
                key={cond.value}
                type="button"
                onClick={() => updateParam("condition", cond.value)}
                className={clsx(
                  "w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between",
                  isSelected
                    ? "bg-[#171717] text-white font-semibold"
                    : "text-[#171717] hover:bg-[#F7F7F8]"
                )}
              >
                <span>{cond.label}</span>
                {isSelected && <span className="text-white text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ─── Top Control Bar: Search Input, Quick Chips & Sort Select ─── */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 sm:p-5 mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari model iPhone, varian, atau aksesori..."
              className="w-full pl-10 pr-20 py-2.5 bg-[#F7F7F8] border border-[#E5E5E5] rounded-full text-xs sm:text-sm text-[#171717] placeholder-[#737373] focus:outline-none focus:border-[#171717] focus:bg-white transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-[#737373] hover:text-[#171717]"
                title="Hapus pencarian"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#171717] text-white text-xs font-semibold rounded-full hover:bg-black transition-colors"
            >
              Cari
            </button>
          </form>

          {/* Sort Selector & Mobile Filter Toggle */}
          <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-full border border-[#E5E5E5] bg-white text-xs font-semibold text-[#171717] hover:bg-[#F7F7F8]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#171717] text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex items-center space-x-2 flex-1 sm:flex-initial">
              <label htmlFor="sort-select" className="text-xs font-semibold text-[#737373] hidden sm:inline whitespace-nowrap">
                Urutkan:
              </label>
              <select
                id="sort-select"
                value={currentSort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-full border border-[#E5E5E5] bg-[#F7F7F8] text-xs font-semibold text-[#171717] focus:outline-none focus:border-[#171717] cursor-pointer"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-[#E5E5E5]">
          <span className="text-[11px] font-bold text-[#737373] uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Pilihan:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = currentCategory.toLowerCase() === cat.value.toLowerCase();
            return (
              <button
                key={cat.value}
                onClick={() => updateParam("category", cat.value)}
                className={clsx(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0",
                  isSelected
                    ? "bg-[#171717] text-white shadow-2xs"
                    : "bg-[#F7F7F8] text-[#171717] hover:bg-[#EAEAEA]"
                )}
              >
                {cat.label}
              </button>
            );
          })}
          {SERIES_LIST.filter((s) => s.value !== "all").map((s) => {
            const isSelected = currentSeries.toLowerCase() === s.value.toLowerCase();
            return (
              <button
                key={s.value}
                onClick={() => updateParam("series", isSelected ? "all" : s.value)}
                className={clsx(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 border",
                  isSelected
                    ? "bg-[#171717] text-white border-[#171717] shadow-2xs"
                    : "bg-white text-[#171717] border-[#E5E5E5] hover:bg-[#F7F7F8]"
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Main Catalog Content: Desktop Sidebar + Product Grid / Children ─── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Sticky Sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-[#E5E5E5] p-5">
            {filterContent}
          </div>
        </aside>

        {/* Product Grid / Empty State */}
        {children}
      </div>

      {/* ─── Mobile Slide-Over Drawer ─── */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Drawer content */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E5E5]">
                <h3 className="font-bold text-[#171717] text-base">Filter Produk</h3>
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1 rounded-lg text-[#737373] hover:text-[#171717]"
                >
                  ✕
                </button>
              </div>
              {filterContent}
            </div>

            <div className="pt-6 border-t border-[#E5E5E5] mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleResetAll}
                className="flex-1 py-2.5 rounded-full border border-[#E5E5E5] text-xs font-semibold text-[#171717] hover:bg-[#F7F7F8]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-[#171717] text-white text-xs font-bold hover:bg-black transition-colors"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
