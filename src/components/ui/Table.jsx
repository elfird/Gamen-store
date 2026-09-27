import { cn } from "@/lib/utils";
import { TableSkeleton } from "./Skeleton";
import EmptyState from "./EmptyState";

/**
 * @typedef {{
 *   key: string,
 *   header: string,
 *   width?: string,
 *   align?: "left"|"center"|"right",
 *   render?: (value: any, row: any, index: number) => React.ReactNode,
 * }} Column
 */

/**
 * @param {{
 *   columns: Column[],
 *   data: any[],
 *   keyExtractor?: (row: any, index: number) => string,
 *   loading?: boolean,
 *   emptyTitle?: string,
 *   emptyDescription?: string,
 *   emptyAction?: React.ReactNode,
 *   className?: string,
 *   stickyHeader?: boolean,
 *   onRowClick?: (row: any) => void,
 * }} props
 */
export default function Table({
  columns = [],
  data = [],
  keyExtractor,
  loading = false,
  emptyTitle,
  emptyDescription,
  emptyAction,
  className,
  stickyHeader = false,
  onRowClick,
}) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-lg border border-border", className)}>
      <table className="w-full min-w-full border-collapse text-sm">
        <thead className={cn("bg-background", stickyHeader && "sticky top-0 z-10")}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-secondary border-b border-border",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  !col.align && "text-left"
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {loading ? (
          <TableSkeleton columns={columns.length} rows={5} />
        ) : data.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={columns.length}>
                <EmptyState
                  title={emptyTitle}
                  description={emptyDescription}
                  action={emptyAction}
                />
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {data.map((row, rowIndex) => {
              const key = keyExtractor ? keyExtractor(row, rowIndex) : row.id ?? rowIndex;
              return (
                <tr
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b border-border last:border-0 bg-surface",
                    onRowClick && "cursor-pointer hover:bg-background transition-colors",
                    "group"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-text",
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                        !col.align && "text-left"
                      )}
                    >
                      {col.render
                        ? col.render(row[col.key], row, rowIndex)
                        : row[col.key] ?? <span className="text-secondary">—</span>}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </div>
  );
}
