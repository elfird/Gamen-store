"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * @param {{
 *   label?: string,
 *   error?: string,
 *   helperText?: string,
 *   containerClassName?: string,
 *   rows?: number,
 * } & React.TextareaHTMLAttributes<HTMLTextAreaElement>} props
 */
const Textarea = forwardRef(function Textarea(
  {
    label,
    id,
    name,
    placeholder,
    error,
    helperText,
    disabled,
    required,
    rows = 4,
    containerClassName,
    className,
    ...props
  },
  ref
) {
  const inputId = id ?? name;

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text leading-none">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">*</span>
          )}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined
        }
        className={cn(
          "w-full rounded-md border bg-surface px-3 py-2.5 text-sm text-text",
          "placeholder:text-secondary resize-y min-h-[80px]",
          "transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          error
            ? "border-danger focus:ring-danger/30 focus:border-danger"
            : "border-border focus:ring-primary/20 focus:border-primary",
          disabled && "cursor-not-allowed bg-background opacity-60",
          className
        )}
        {...props}
      />

      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-danger leading-none">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-secondary leading-none">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Textarea;
