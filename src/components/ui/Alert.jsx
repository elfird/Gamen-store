"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const variantStyles = {
  success: {
    container: "bg-success-light border-success/20 text-success",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M13.5 4.5l-7 7L3 8" stroke="currentColor" strokeWidth="1.75"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  warning: {
    container: "bg-warning-light border-warning/20 text-warning",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 6v3M8 11h.01M7.134 2.5L1.268 13A1 1 0 002.134 14.5h11.732a1 1 0 00.866-1.5L8.866 2.5a1 1 0 00-1.732 0z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  danger: {
    container: "bg-danger-light border-danger/20 text-danger",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 5v3M8 10h.01" stroke="currentColor" strokeWidth="1.75"
          strokeLinecap="round" />
      </svg>
    ),
  },
  info: {
    container: "bg-info-light border-info/20 text-info",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 7v4M8 5h.01" stroke="currentColor" strokeWidth="1.75"
          strokeLinecap="round" />
      </svg>
    ),
  },
  default: {
    container: "bg-background border-border text-text",
    icon: null,
  },
};

/**
 * @param {{
 *   variant?: keyof typeof variantStyles,
 *   title?: string,
 *   dismissible?: boolean,
 *   onDismiss?: () => void,
 *   className?: string,
 *   children?: React.ReactNode,
 * }} props
 */
export default function Alert({
  variant = "default",
  title,
  dismissible = false,
  onDismiss,
  className,
  children,
}) {
  const [dismissed, setDismissed] = useState(false);
  const style = variantStyles[variant] ?? variantStyles.default;

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-lg border px-4 py-3 text-sm",
        style.container,
        className
      )}
    >
      {style.icon && (
        <span className="mt-0.5 shrink-0">{style.icon}</span>
      )}

      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold leading-tight mb-0.5">{title}</p>}
        {children && <div className="leading-relaxed">{children}</div>}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Tutup"
          className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-1 focus-visible:ring-current"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
