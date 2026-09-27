import { cn } from "@/lib/utils";

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

/**
 * A flat surface container. No excessive shadow or border-radius.
 *
 * @param {{
 *   padding?: keyof typeof paddingStyles,
 *   border?: boolean,
 *   shadow?: boolean,
 *   className?: string,
 *   children?: React.ReactNode,
 *   as?: React.ElementType,
 * } & React.HTMLAttributes<HTMLDivElement>} props
 */
export default function Card({
  padding = "md",
  border = true,
  shadow = false,
  className,
  children,
  as: Tag = "div",
  ...props
}) {
  return (
    <Tag
      className={cn(
        "rounded-lg bg-surface",
        border && "border border-border",
        shadow && "shadow-md",
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
