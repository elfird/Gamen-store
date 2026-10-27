import clsx from "clsx";
import PageContainer from "./PageContainer";

/**
 * SectionContainer — Section wrapper with standard vertical rhythm and optional header.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {string} [props.badge]
 * @param {React.ReactNode} [props.action]
 * @param {"surface" | "muted" | "dark" | "transparent"} [props.variant="transparent"]
 * @param {"sm" | "md" | "lg" | "xl"} [props.padding="lg"]
 * @param {string} [props.className]
 * @param {string} [props.containerSize="default"]
 */
export default function SectionContainer({
  children,
  title,
  subtitle,
  badge,
  action,
  variant = "transparent",
  padding = "lg",
  className,
  containerSize = "default",
  ...props
}) {
  const variantStyles = {
    transparent: "bg-transparent",
    surface: "bg-white",
    muted: "bg-[#F7F7F8]",
    dark: "bg-[#171717] text-white",
  };

  const paddingStyles = {
    sm: "py-6 sm:py-8",
    md: "py-8 sm:py-10",
    lg: "py-10 sm:py-14",
    xl: "py-14 sm:py-18",
  };

  const isDark = variant === "dark";

  return (
    <section
      className={clsx(
        "w-full transition-colors",
        variantStyles[variant] || variantStyles.transparent,
        paddingStyles[padding] || paddingStyles.lg,
        className
      )}
      {...props}
    >
      <PageContainer size={containerSize}>
        {(title || subtitle || badge || action) && (
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div className="max-w-2xl">
              {badge && (
                <div className="mb-1">
                  <span
                    className={clsx(
                      "text-[10px] sm:text-[11px] font-bold tracking-widest uppercase",
                      isDark ? "text-white/60" : "text-[#737373]"
                    )}
                  >
                    {badge}
                  </span>
                </div>
              )}
              {title && (
                <h2
                  className={clsx(
                    "text-xl sm:text-2xl font-bold tracking-tight",
                    isDark ? "text-white" : "text-[#171717]"
                  )}
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p
                  className={clsx(
                    "mt-1 text-xs sm:text-sm leading-relaxed",
                    isDark ? "text-white/70" : "text-[#737373]"
                  )}
                >
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </PageContainer>
    </section>
  );
}
