"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { formatCurrency } from "@/lib/utils";

/**
 * ProductCard — Clean Editorial Commerce product card component.
 *
 * Implements refined mockup specifications:
 * - Clean white card with crisp #E5E5E5 border and 12px rounded corner (rounded-xl)
 * - Single subtle badge at top-left (New / Best Seller / Discount / Like New)
 * - Prominent product image with generous whitespace and consistent aspect-ratio
 * - Information hierarchy: Image -> Title -> Variant/Condition -> Price -> CTA
 * - Pinned price and CTA alignment across all cards via mt-auto
 * - Clean, non-distracting hover state without heavy box-shadow
 *
 * @param {Object} props
 * @param {Object} props.product - Formatted product object from product.service
 * @param {boolean} [props.featured=false] - Optional featured styling
 * @param {string} [props.className]
 */
export default function ProductCard({ product, featured = false, className }) {
  const [imageError, setImageError] = useState(false);
  if (!product) return null;

  const {
    name,
    slug,
    condition,
    primaryImage,
    minPrice,
    minCompareAtPrice,
    availableStorages = [],
    availableColors = [],
    featured: isProductFeatured,
  } = product;

  // Calculate discount percentage if compareAtPrice is higher than minPrice
  const hasDiscount = minCompareAtPrice && Number(minCompareAtPrice) > Number(minPrice);
  const discountPercent = hasDiscount
    ? Math.round(((Number(minCompareAtPrice) - Number(minPrice)) / Number(minCompareAtPrice)) * 100)
    : 0;

  // Single badge priority: Discount > Featured / New > Condition
  let badgeText = null;
  let badgeStyle = "bg-[#171717] text-white";

  if (hasDiscount && discountPercent > 0) {
    badgeText = `-${discountPercent}%`;
    badgeStyle = "bg-[#16A34A] text-white";
  } else if (featured || isProductFeatured) {
    badgeText = "New";
    badgeStyle = "bg-[#171717] text-white";
  } else if (condition && condition !== "NEW") {
    badgeText = "Like New";
    badgeStyle = "bg-[#F7F7F8] text-[#171717] border border-[#E5E5E5]";
  }

  // Format storage/variant subtitle line
  let variantSubtitle = "";
  if (availableStorages.length > 0 && availableStorages[0] !== "Standard") {
    variantSubtitle = availableStorages.slice(0, 2).join(", ");
    if (availableColors.length > 0 && availableColors[0] !== "Standard") {
      variantSubtitle += ` • ${availableColors.length} Warna`;
    }
  } else if (availableColors.length > 0 && availableColors[0] !== "Standard") {
    variantSubtitle = availableColors.slice(0, 3).join(", ");
  }

  return (
    <div
      className={clsx(
        "group relative flex flex-col justify-between bg-white rounded-xl p-3.5 sm:p-4 transition-colors duration-150",
        "border border-[#E5E5E5] hover:border-[#171717]/40",
        className
      )}
    >
      <div>
        {/* Top Single Subtle Badge (Top-Left) */}
        <div className="h-5 mb-1.5 flex items-center justify-between">
          {badgeText ? (
            <span
              className={clsx(
                "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide",
                badgeStyle
              )}
            >
              {badgeText}
            </span>
          ) : (
            <span />
          )}
        </div>

        {/* Product Visual Area */}
        <Link
          href={`/products/${slug}`}
          className="block relative w-full aspect-square mb-3 rounded-lg bg-transparent overflow-hidden flex items-center justify-center"
          aria-label={`Lihat detail ${name}`}
        >
          {primaryImage && !imageError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={primaryImage}
              alt={name}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            /* Elegant minimalist SVG fallback */
            <div className="flex flex-col items-center justify-center p-4 text-center space-y-2 text-[#171717]">
              <div className="w-12 h-16 rounded-lg border border-[#E5E5E5] bg-[#F7F7F8] flex flex-col items-center justify-between p-1.5 group-hover:scale-105 transition-transform duration-200">
                <div className="w-3 h-0.5 rounded-full bg-[#171717]/30" />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12" y2="18.01" />
                </svg>
                <div className="w-2 h-0.5 rounded-full bg-[#171717]/30" />
              </div>
            </div>
          )}
        </Link>

        {/* Product Info */}
        <div className="space-y-0.5">
          <h3 className="text-xs sm:text-sm font-semibold text-[#171717] tracking-tight group-hover:text-black transition-colors line-clamp-1">
            <Link href={`/products/${slug}`}>
              {name}
            </Link>
          </h3>

          <p className="text-[11px] sm:text-xs text-[#737373] line-clamp-1 min-h-[16px]">
            {variantSubtitle || (condition === "NEW" ? "Baru Segel • Resmi" : "Like New • Ex-Resmi")}
          </p>
        </div>
      </div>

      {/* Bottom Price & Full-Width CTA (Pinned to bottom for clean horizontal alignment) */}
      <div className="mt-auto pt-3">
        <div className="mb-2.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <p className="text-xs sm:text-sm font-bold text-[#171717] tracking-tight">
              {formatCurrency(minPrice)}
            </p>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-[#737373] line-through font-normal">
                {formatCurrency(minCompareAtPrice)}
              </span>
            )}
          </div>
        </div>

        <Link href={`/products/${slug}`} className="block w-full">
          <button
            type="button"
            className="w-full py-2 px-3 rounded-lg bg-[#171717] hover:bg-black text-white text-xs font-semibold tracking-tight transition-colors text-center cursor-pointer"
          >
            Pilih Varian
          </button>
        </Link>
      </div>
    </div>
  );
}
