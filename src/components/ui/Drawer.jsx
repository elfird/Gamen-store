"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const widthStyles = {
  sm: "max-w-xs",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   title?: string,
 *   size?: keyof typeof widthStyles,
 *   side?: "right"|"left",
 *   footer?: React.ReactNode,
 *   className?: string,
 *   children?: React.ReactNode,
 * }} props
 */
export default function Drawer({
  isOpen,
  onClose,
  title,
  size = "md",
  side = "right",
  footer,
  className,
  children,
}) {
  const handleEsc = useCallback(
    (e) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEsc]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "absolute top-0 bottom-0 z-10 flex flex-col bg-surface border-border shadow-lg",
          "w-full",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
          widthStyles[size] ?? widthStyles.md,
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border shrink-0">
          {title && (
            <h2 className="text-base font-semibold text-primary leading-none">{title}</h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel"
            className="ml-auto shrink-0 rounded-md p-1.5 text-secondary hover:text-text hover:bg-background transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 px-5 py-4 border-t border-border bg-background">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
