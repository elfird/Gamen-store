"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

/**
 * @typedef {{ label: string, onClick?: () => void, href?: string, disabled?: boolean, danger?: boolean, divider?: boolean, icon?: React.ReactNode }} DropdownItem
 */

/**
 * @param {{
 *   trigger: React.ReactNode,
 *   items: DropdownItem[],
 *   align?: "left"|"right",
 *   className?: string,
 * }} props
 */
export default function Dropdown({ trigger, items = [], align = "right", className }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, close]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);

  return (
    <div ref={containerRef} className={cn("relative inline-flex", className)}>
      {/* Trigger */}
      <div onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open}>
        {trigger}
      </div>

      {/* Menu */}
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute top-full mt-1.5 z-40 min-w-[180px] bg-surface rounded-lg border border-border shadow-lg py-1",
            "overflow-hidden",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, idx) => {
            if (item.divider) {
              return <div key={idx} className="my-1 border-t border-border" aria-hidden="true" />;
            }

            const Tag = item.href ? "a" : "button";
            return (
              <Tag
                key={idx}
                role="menuitem"
                href={item.href}
                type={item.href ? undefined : "button"}
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.();
                    close();
                  }
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3.5 py-2 text-sm transition-colors",
                  item.danger
                    ? "text-danger hover:bg-danger-light"
                    : "text-text hover:bg-background",
                  item.disabled && "opacity-40 pointer-events-none"
                )}
              >
                {item.icon && (
                  <span className="shrink-0 text-current opacity-60">{item.icon}</span>
                )}
                {item.label}
              </Tag>
            );
          })}
        </div>
      )}
    </div>
  );
}
