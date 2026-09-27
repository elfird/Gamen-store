import { cn } from "@/lib/utils";

/**
 * @param {{
 *   title?: string,
 *   description?: string,
 *   action?: React.ReactNode,
 *   className?: string,
 * }} props
 */
export default function ErrorState({
  title = "Terjadi kesalahan",
  description = "Gagal memuat data. Coba lagi atau hubungi administrator.",
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      <div className="mb-4 h-12 w-12 rounded-full bg-danger-light flex items-center justify-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-danger"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>

      <h3 className="text-base font-semibold text-text mb-1">{title}</h3>

      {description && (
        <p className="text-sm text-secondary max-w-sm leading-relaxed mb-4">{description}</p>
      )}

      {action && <div>{action}</div>}
    </div>
  );
}
