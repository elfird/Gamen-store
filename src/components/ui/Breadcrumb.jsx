import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @param {{
 *   items: Array<{ label: string, href?: string }>,
 *   className?: string,
 * }} props
 */
export default function Breadcrumb({ items = [], className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center flex-wrap gap-0">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={idx} className="flex items-center">
              {idx > 0 && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className="mx-1.5 text-border shrink-0"
                >
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.25"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}

              {isLast || !item.href ? (
                <span
                  className={cn(
                    "text-sm",
                    isLast ? "text-text font-medium" : "text-secondary"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm text-secondary hover:text-text transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
