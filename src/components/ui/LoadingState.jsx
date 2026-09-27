import { cn } from "@/lib/utils";

/**
 * @param {{
 *   message?: string,
 *   size?: "sm"|"md"|"lg",
 *   className?: string,
 * }} props
 */
export default function LoadingState({
  message = "Memuat...",
  size = "md",
  className,
}) {
  const spinnerSize = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" }[size];
  const textSize = { sm: "text-xs", md: "text-sm", lg: "text-base" }[size];
  const padding = { sm: "py-8", md: "py-16", lg: "py-24" }[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        padding,
        className
      )}
      role="status"
      aria-label={message}
    >
      <span
        aria-hidden="true"
        className={cn(
          "animate-spin rounded-full border-2 border-border border-t-primary",
          spinnerSize
        )}
      />
      {message && (
        <p className={cn("text-secondary", textSize)}>{message}</p>
      )}
    </div>
  );
}
