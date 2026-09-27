"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * @param {{
 *   label?: string,
 *   error?: string,
 *   helperText?: string,
 *   leftAddon?: React.ReactNode,
 *   rightAddon?: React.ReactNode,
 *   containerClassName?: string,
 * } & React.InputHTMLAttributes<HTMLInputElement>} props
 */
const Input = forwardRef(function Input(
  {
    label,
    id,
    name,
    type = "text",
    placeholder,
    error,
    helperText,
    disabled,
    required,
    leftAddon,
    rightAddon,
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
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text leading-none"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {leftAddon && (
          <div className="pointer-events-none absolute left-3 flex items-center text-secondary">
            {leftAddon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined
          }
          className={cn(
            "h-10 w-full rounded-md border bg-surface px-3 text-sm text-text",
            "placeholder:text-secondary",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-danger focus:ring-danger/30 focus:border-danger"
              : "border-border focus:ring-primary/20 focus:border-primary",
            disabled && "cursor-not-allowed bg-background opacity-60",
            leftAddon && "pl-9",
            rightAddon && "pr-9",
            className
          )}
          {...props}
        />

        {rightAddon && (
          <div className="pointer-events-none absolute right-3 flex items-center text-secondary">
            {rightAddon}
          </div>
        )}
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

export default Input;
