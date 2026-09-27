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
    surface: "bg-white border-y border-[#D2D2D7]/40",
    muted: "bg-[#F5F5F7]",
    dark: "bg-[#111111] text-white",
  };

  const paddingStyles = {
    sm: "py-6 sm:py-8",
    md: "py-10 sm:py-14",
    lg: "py-14 sm:py-20",
    xl: "py-20 sm:py-28",
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
          <div className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="max-w-2xl">
              {badge && (
                <div className="mb-2.5">
                  <span
                    className={clsx(
                      "inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full tracking-wide uppercase",
                      isDark
                        ? "bg-white/10 text-white/90"
                        : "bg-[#111111]/5 text-[#111111]"
                    )}
                  >
                    {badge}
                  </span>
                </div>
              )}
              {title && (
                <h2
                  className={clsx(
                    "text-2xl sm:text-3xl font-semibold tracking-tight",
                    isDark ? "text-white" : "text-[#1D1D1F]"
                  )}
                >
                  {title}
                </h2>
              )}
              {subtitle && (
                <p
                  className={clsx(
                    "mt-2 text-sm sm:text-base leading-relaxed",
                    isDark ? "text-white/70" : "text-[#6E6E73]"
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
