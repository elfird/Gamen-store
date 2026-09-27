"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * @param {{
 *   label?: string,
 *   description?: string,
 *   error?: string,
 *   containerClassName?: string,
 * } & React.InputHTMLAttributes<HTMLInputElement>} props
 */
const Radio = forwardRef(function Radio(
  { label, description, error, id, name, disabled, containerClassName, className, ...props },
  ref
) {
  const inputId = id ?? `${name}-${props.value}`;

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      <label
        htmlFor={inputId}
        className={cn(
          "flex items-start gap-3 cursor-pointer",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <div className="relative mt-0.5 flex-shrink-0">
          <input
            ref={ref}
            id={inputId}
            name={name}
            type="radio"
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              "peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-border bg-surface",
              "transition-colors duration-150",
              "checked:border-primary checked:bg-surface",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
              error && "border-danger",
              disabled && "cursor-not-allowed",
              className
            )}
            {...props}
          />
          {/* Inner dot */}
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center
              opacity-0 peer-checked:opacity-100"
            aria-hidden="true"
          >
            <span className="h-2 w-2 rounded-full bg-primary" />
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          {label && (
            <span className="text-sm font-medium text-text leading-tight">{label}</span>
          )}
          {description && (
            <span className="text-xs text-secondary leading-tight">{description}</span>
          )}
        </div>
      </label>

      {error && (
        <p role="alert" className="text-xs text-danger ml-7">
          {error}
        </p>
      )}
    </div>
  );
});

export default Radio;
