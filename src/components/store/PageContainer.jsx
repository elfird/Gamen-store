import clsx from "clsx";

/**
 * PageContainer — Standard max-width container for store pages.
 *
 * Ensures consistent horizontal margins, padding, and max-width across
 * all viewport sizes (360px up to 1440px+).
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {"default" | "narrow" | "wide" | "full"} [props.size="default"]
 */
export default function PageContainer({
  children,
  className,
  size = "default",
  ...props
}) {
  const sizeClasses = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[1400px]",
    full: "max-w-full",
  };

  return (
    <div
      className={clsx(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeClasses[size] || sizeClasses.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
