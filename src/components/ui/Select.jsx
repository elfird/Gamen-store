"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * @param {{
 *   label?: string,
 *   options: Array<{ value: string|number, label: string, disabled?: boolean }>,
 *   placeholder?: string,
 *   error?: string,
 *   helperText?: string,
 *   containerClassName?: string,
 * } & React.SelectHTMLAttributes<HTMLSelectElement>} props
 */
const Select = forwardRef(function Select(
  {
    label,
    id,
    name,
    options = [],
    placeholder,
    error,
    helperText,
    disabled,
    required,
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

      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          name={name}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined
          }
          className={cn(
            "h-10 w-full appearance-none rounded-md border bg-surface pl-3 pr-9 text-sm text-text",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-danger focus:ring-danger/30 focus:border-danger"
              : "border-border focus:ring-primary/20 focus:border-primary",
            disabled && "cursor-not-allowed bg-background opacity-60",
            !props.value && placeholder ? "text-secondary" : "text-text",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

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

export default Select;
