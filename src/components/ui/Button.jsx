"use client";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary text-white hover:bg-[#333] active:bg-black",
  secondary:
    "bg-[#f0f0f0] text-text hover:bg-[#e5e5e5] active:bg-[#ddd]",
  outline:
    "border border-border bg-surface text-text hover:bg-background active:bg-[#ebebeb]",
  ghost:
    "bg-transparent text-text hover:bg-background active:bg-[#ebebeb]",
  danger:
    "bg-danger text-white hover:bg-[#b91c1c] active:bg-[#991b1b]",
  "danger-outline":
    "border border-danger text-danger hover:bg-danger-light active:bg-[#fecaca]",
};

const sizes = {
  xs: "h-7 px-2.5 text-xs gap-1",
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

/**
 * @param {{
 *   variant?: keyof typeof variants,
 *   size?: keyof typeof sizes,
 *   loading?: boolean,
 *   disabled?: boolean,
 *   fullWidth?: boolean,
 *   leftIcon?: React.ReactNode,
 *   rightIcon?: React.ReactNode,
 *   className?: string,
 *   children?: React.ReactNode,
 *   type?: "button"|"submit"|"reset",
 * } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  className,
  children,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium",
        "transition-colors duration-150 select-none whitespace-nowrap",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        leftIcon && <span aria-hidden="true" className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && (
        <span aria-hidden="true" className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}
