import { cn } from "@/lib/utils";

/**
 * @param {{
 *   width?: string,
 *   height?: string,
 *   rounded?: "none"|"sm"|"md"|"lg"|"full",
 *   lines?: number,
 *   className?: string,
 * }} props
 */
export function Skeleton({ width, height = "h-4", rounded = "md", lines = 1, className }) {
  const roundedMap = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  if (lines > 1) {
    return (
      <div className="flex flex-col gap-2" aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "animate-pulse bg-[#e5e5e7]",
              height,
              roundedMap[rounded],
              i === lines - 1 && lines > 1 && "w-3/4",
              className
            )}
            style={width ? { width } : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-[#e5e5e7]",
        height,
        roundedMap[rounded],
        className
      )}
      style={width ? { width } : undefined}
    />
  );
}

/**
 * Skeleton for a table row — reusable in any data table.
 * @param {{ columns?: number, rows?: number }} props
 */
export function TableSkeleton({ columns = 4, rows = 5 }) {
  return (
    <tbody aria-busy="true" aria-label="Memuat data...">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={rowIdx} className="border-b border-border">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={colIdx} className="px-4 py-3">
              <Skeleton height="h-4" width={colIdx === 0 ? "80%" : colIdx === columns - 1 ? "60%" : "70%"} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

/**
 * Skeleton for a card.
 */
export function CardSkeleton({ className }) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface p-5 space-y-3", className)}>
      <Skeleton height="h-4" width="60%" />
      <Skeleton height="h-3" lines={3} />
      <Skeleton height="h-8" width="40%" rounded="md" />
    </div>
  );
}

export default Skeleton;
