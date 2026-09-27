"use client";

import { cn } from "@/lib/utils";

/**
 * @param {{
 *   currentPage: number,
 *   totalPages: number,
 *   onPageChange: (page: number) => void,
 *   total?: number,
 *   pageSize?: number,
 *   className?: string,
 * }} props
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  total,
  pageSize,
  className,
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      }
    }

    // Insert ellipsis
    const withEllipsis = [];
    let prev = null;
    for (const page of pages) {
      if (prev !== null && page - prev > 1) {
        withEllipsis.push("...");
      }
      withEllipsis.push(page);
      prev = page;
    }
    return withEllipsis;
  };

  const btnBase =
    "inline-flex items-center justify-center h-8 min-w-[2rem] rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:opacity-40 disabled:pointer-events-none";

  const from = total ? (currentPage - 1) * (pageSize ?? 20) + 1 : null;
  const to = total ? Math.min(currentPage * (pageSize ?? 20), total) : null;

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-3", className)}>
      {/* Info */}
      {total !== undefined && (
        <p className="text-sm text-secondary">
          {from}–{to} dari {total.toLocaleString("id-ID")} data
        </p>
      )}

      {/* Page buttons */}
      <nav aria-label="Navigasi halaman" className="flex items-center gap-1">
        {/* Prev */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Halaman sebelumnya"
          className={cn(btnBase, "px-2.5 border border-border text-secondary hover:bg-background hover:text-text")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-secondary text-sm select-none">
              ···
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-label={`Halaman ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                btnBase,
                page === currentPage
                  ? "bg-primary text-white border border-primary"
                  : "border border-border text-text hover:bg-background"
              )}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Halaman berikutnya"
          className={cn(btnBase, "px-2.5 border border-border text-secondary hover:bg-background hover:text-text")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
