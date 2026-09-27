"use client";

import { useState } from "react";
import clsx from "clsx";

/**
 * ProductGallery — Interactive image gallery for product detail page.
 *
 * Displays primary image with clickable thumbnail gallery and fallback device frames.
 *
 * @param {Object} props
 * @param {Array<{ id: string, url: string, alt?: string, isPrimary?: boolean }>} [props.images=[]]
 * @param {string} props.productName
 * @param {string} [props.condition="NEW"]
 */
export default function ProductGallery({
  images = [],
  productName,
  condition = "NEW",
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [{ url: null, alt: productName }];
  const activeImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="flex flex-col space-y-4">
      {/* Main Showcase Stage */}
      <div className="relative w-full aspect-square sm:aspect-4/3 lg:aspect-square bg-white rounded-3xl border border-[#D2D2D7]/60 p-8 flex items-center justify-center overflow-hidden shadow-xs">
        {/* Condition / Guarantee Top Tag */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          {condition === "NEW" ? (
            <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-[#111111] text-white tracking-wide">
              Brand New In Box
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20 tracking-wide">
              Like New 99%
            </span>
          )}
        </div>

        {/* Product Visual */}
        {activeImage.url && !activeImage.url.startsWith("/images/") ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={activeImage.url}
            alt={activeImage.alt || productName}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
          />
        ) : (
          /* Apple Pro Device Silhouette Frame */
          <div className="flex flex-col items-center justify-center text-center space-y-4 text-[#111111] p-6 animate-fade-in">
            <div className="relative w-28 h-40 sm:w-36 sm:h-52 rounded-3xl border-3 border-[#111111] bg-[#F5F5F7] shadow-lg flex flex-col items-center justify-between p-3 transition-transform duration-300 hover:scale-105">
              {/* Dynamic Island Bar */}
              <div className="w-10 h-2 rounded-full bg-[#111111]" />
              
              {/* Screen Logo / Icon */}
              <div className="flex flex-col items-center space-y-1">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12" y2="18.01" />
                </svg>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#86868B]">
                  Gamen Store
                </span>
              </div>

              {/* Home Indicator */}
              <div className="w-12 h-1 rounded-full bg-[#111111]/40" />
            </div>
            <p className="text-xs font-medium text-[#86868B] max-w-xs">
              Foto Produk Resmi & Segel Asli {productName}
            </p>
          </div>
        )}
      </div>

      {/* Thumbnail Strip (if multiple images) */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {displayImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={clsx(
                  "relative w-20 h-20 rounded-2xl bg-white border p-2 shrink-0 transition-all flex items-center justify-center overflow-hidden focus:outline-none",
                  isSelected
                    ? "border-[#111111] ring-2 ring-[#111111]/10 shadow-xs"
                    : "border-[#D2D2D7]/60 hover:border-[#86868B]"
                )}
                aria-label={`Pilih foto ${idx + 1}`}
              >
                {img.url && !img.url.startsWith("/images/") ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={img.url}
                    alt={img.alt || `${productName} view ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-8 h-12 rounded-lg border border-[#111111]/60 bg-[#F5F5F7] flex items-center justify-center text-[9px] font-bold text-[#6E6E73]">
                    {idx + 1}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
