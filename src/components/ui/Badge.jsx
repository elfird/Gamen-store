import { cn } from "@/lib/utils";

const variantStyles = {
  default:  "bg-[#f0f0f0] text-text",
  primary:  "bg-primary text-white",
  success:  "bg-success-light text-success",
  warning:  "bg-warning-light text-warning",
  danger:   "bg-danger-light text-danger",
  info:     "bg-info-light text-info",
  outline:  "border border-border text-secondary bg-transparent",
};

const sizeStyles = {
  sm: "px-1.5 py-0.5 text-[10px] font-semibold",
  md: "px-2 py-0.5 text-xs font-semibold",
  lg: "px-2.5 py-1 text-sm font-medium",
};

const dotColors = {
  default: "bg-secondary",
  primary: "bg-white",
  success: "bg-success",
  warning: "bg-warning",
  danger:  "bg-danger",
  info:    "bg-info",
  outline: "bg-secondary",
};

/**
 * @param {{
 *   variant?: keyof typeof variantStyles,
 *   size?: keyof typeof sizeStyles,
 *   dot?: boolean,
 *   className?: string,
 *   children: React.ReactNode,
 * }} props
 */
export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className,
  children,
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full leading-none",
        variantStyles[variant] ?? variantStyles.default,
        sizeStyles[size] ?? sizeStyles.md,
        className
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            dotColors[variant] ?? dotColors.default
          )}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
