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
  const [errorMap, setErrorMap] = useState({});

  const displayImages = images.length > 0 ? images : [{ url: null, alt: productName }];
  const activeImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="flex flex-col space-y-4">
      {/* Main Showcase Stage */}
      <div className="relative w-full aspect-square sm:aspect-4/3 lg:aspect-square bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 flex items-center justify-center overflow-hidden">
        {/* Condition / Guarantee Top Tag */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          {condition === "NEW" ? (
            <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#171717] text-white tracking-wide">
              Brand New In Box
            </span>
          ) : (
            <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#F7F7F8] text-[#171717] border border-[#E5E5E5] tracking-wide">
              Like New 99%
            </span>
          )}
        </div>

        {/* Product Visual */}
        {activeImage.url && !errorMap[activeImage.url] ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={activeImage.url}
            alt={activeImage.alt || productName}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            onError={() => setErrorMap((prev) => ({ ...prev, [activeImage.url]: true }))}
          />
        ) : (
          /* Apple Pro Device Silhouette Frame */
          <div className="flex flex-col items-center justify-center text-center space-y-3 text-[#171717] p-6 animate-fade-in">
            <div className="relative w-24 h-36 sm:w-32 sm:h-48 rounded-2xl border-2 border-[#171717] bg-[#F7F7F8] flex flex-col items-center justify-between p-2.5 transition-transform duration-300 hover:scale-105">
              <div className="w-8 h-1.5 rounded-full bg-[#171717]" />
              <div className="flex flex-col items-center space-y-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12" y2="18.01" />
                </svg>
              </div>
              <div className="w-10 h-0.5 rounded-full bg-[#171717]/40" />
            </div>
            <p className="text-xs font-medium text-[#737373] max-w-xs">
              {productName}
            </p>
          </div>
        )}
      </div>

      {/* Thumbnail Strip (if multiple images) */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {displayImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={clsx(
                  "relative w-18 h-18 rounded-xl bg-white border p-2 shrink-0 transition-all flex items-center justify-center overflow-hidden focus:outline-none",
                  isSelected
                    ? "border-[#171717] ring-1 ring-[#171717]"
                    : "border-[#E5E5E5] hover:border-[#737373]"
                )}
                aria-label={`Pilih foto ${idx + 1}`}
              >
                {img.url && !errorMap[img.url] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={img.url}
                    alt={img.alt || `${productName} view ${idx + 1}`}
                    className="w-full h-full object-contain"
                    onError={() => setErrorMap((prev) => ({ ...prev, [img.url]: true }))}
                  />
                ) : (
                  <div className="w-6 h-10 rounded-md border border-[#E5E5E5] bg-[#F7F7F8] flex items-center justify-center text-[9px] font-bold text-[#737373]">
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
