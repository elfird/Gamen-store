import Link from "next/link";
import clsx from "clsx";
import { formatCurrency } from "@/lib/utils";
import { Badge, Button } from "@/components/ui";

/**
 * ProductCard — Reusable storefront product card component.
 *
 * Designed to Apple-standard aesthetics:
 * - Clean white card with subtle border & hover elevation
 * - Dynamic price calculation from active variants
 * - Storage & color option badges
 * - Graceful fallback when local image asset is not yet loaded
 *
 * @param {Object} props
 * @param {Object} props.product - Formatted product object from product.service
 * @param {boolean} [props.featured=false] - Optional featured styling
 * @param {string} [props.className]
 */
export default function ProductCard({ product, featured = false, className }) {
  if (!product) return null;

  const {
    name,
    slug,
    description,
    warranty,
    condition,
    primaryImage,
    minPrice,
    maxPrice,
    availableStorages = [],
    availableColors = [],
    isInStock = true,
    totalStock = 0,
    category,
  } = product;

  // Determine color dot styles based on common iPhone color names
  const getColorHex = (colorName = "") => {
    const lower = colorName.toLowerCase();
    if (lower.includes("desert")) return "#C5A880";
    if (lower.includes("natural")) return "#9F9A8F";
    if (lower.includes("black") || lower.includes("dark")) return "#2D2D2D";
    if (lower.includes("white") || lower.includes("silver")) return "#E8E8ED";
    if (lower.includes("blue") || lower.includes("ultramarine")) return "#3B82F6";
    if (lower.includes("pink")) return "#F472B6";
    if (lower.includes("yellow")) return "#FACC15";
    if (lower.includes("green")) return "#4ADE80";
    return "#8E8E93";
  };

  return (
    <div
      className={clsx(
        "group relative flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all duration-300",
        "border border-[#D2D2D7]/60 hover:border-[#111111]/30 hover:shadow-xl hover:-translate-y-1",
        featured && "ring-1 ring-[#111111]/10",
        className
      )}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            {featured && (
              <Badge variant="primary" size="sm">
                Unggulan
              </Badge>
            )}
            {condition && condition !== "NEW" && (
              <Badge variant="warning" size="sm">
                Like New
              </Badge>
            )}
            {category?.name && (
              <span className="text-[11px] font-medium text-[#86868B] uppercase tracking-wider">
                {category.name}
              </span>
            )}
          </div>

          <div className="shrink-0">
            {isInStock ? (
              <span className="inline-flex items-center text-[11px] font-semibold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded-full">
                Stok {totalStock} unit
              </span>
            ) : (
              <span className="inline-flex items-center text-[11px] font-semibold text-[#DC2626] bg-[#DC2626]/10 px-2 py-0.5 rounded-full">
                Habis
              </span>
            )}
          </div>
        </div>

        {/* Product Visual Area */}
        <Link
          href={`/products/${slug}`}
          className="block relative w-full aspect-4/3 mb-5 rounded-2xl bg-[#F5F5F7] overflow-hidden flex items-center justify-center group-hover:bg-[#EAEAEA] transition-colors"
          aria-label={`Lihat detail ${name}`}
        >
          {primaryImage && !primaryImage.startsWith("/images/") ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={primaryImage}
              alt={name}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            /* Elegant minimalist SVG Silhouette */
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 text-[#111111]">
              <div className="w-16 h-20 rounded-2xl border-2 border-[#111111]/70 bg-white/80 shadow-xs flex flex-col items-center justify-between p-1.5 group-hover:scale-105 transition-transform duration-300">
                <div className="w-4 h-1 rounded-full bg-[#111111]/40" />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <line x1="12" y1="18" x2="12" y2="18.01" />
                </svg>
                <div className="w-2 h-0.5 rounded-full bg-[#111111]/40" />
              </div>
              <span className="text-[11px] font-medium text-[#86868B]">
                {name}
              </span>
            </div>
          )}
        </Link>

        {/* Product Info */}
        <div className="space-y-1.5">
          <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight group-hover:text-[#111111] transition-colors line-clamp-1">
            <Link href={`/products/${slug}`}>
              {name}
            </Link>
          </h3>

          {warranty && (
            <p className="text-xs text-[#6E6E73] flex items-center space-x-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{warranty}</span>
            </p>
          )}

          {description && (
            <p className="text-xs text-[#6E6E73] line-clamp-2 leading-relaxed pt-1">
              {description}
            </p>
          )}
        </div>

        {/* Options Preview: Storage & Colors */}
        <div className="my-4 pt-3 border-t border-[#D2D2D7]/40 flex items-center justify-between text-xs text-[#6E6E73]">
          {/* Storage pills */}
          <div className="flex items-center gap-1 flex-wrap">
            {availableStorages.slice(0, 3).map((st, sIdx) => (
              <span
                key={sIdx}
                className="px-1.5 py-0.5 rounded-md bg-[#F5F5F7] text-[11px] font-medium text-[#1D1D1F]"
              >
                {st}
              </span>
            ))}
            {availableStorages.length > 3 && (
              <span className="text-[10px] text-[#86868B]">
                +{availableStorages.length - 3}
              </span>
            )}
          </div>

          {/* Color Dots */}
          {availableColors.length > 0 && (
            <div className="flex items-center -space-x-1" title={availableColors.join(", ")}>
              {availableColors.slice(0, 4).map((c, cIdx) => (
                <span
                  key={cIdx}
                  className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs inline-block"
                  style={{ backgroundColor: getColorHex(c) }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Price & Action */}
      <div className="pt-2">
        <div className="mb-3">
          <span className="text-[11px] uppercase font-semibold text-[#86868B] tracking-wider block">
            {minPrice === maxPrice || !maxPrice ? "Harga Resmi" : "Mulai Dari"}
          </span>
          <p className="text-lg sm:text-xl font-bold text-[#111111] tracking-tight">
            {formatCurrency(minPrice)}
          </p>
        </div>

        <Link href={`/products/${slug}`} className="block w-full">
          <Button
            variant={featured ? "primary" : "secondary"}
            size="md"
            className="w-full justify-center text-xs sm:text-sm font-semibold rounded-xl"
          >
            Lihat Varian & Order
          </Button>
        </Link>
      </div>
    </div>
  );
}
