"use client";

import { cn } from "@/lib/utils";

/**
 * @param {{
 *   tabs: Array<{ id: string, label: string, badge?: string|number }>,
 *   activeTab: string,
 *   onChange: (id: string) => void,
 *   className?: string,
 *   variant?: "underline"|"pill",
 * }} props
 */
export default function Tabs({ tabs = [], activeTab, onChange, className, variant = "underline" }) {
  if (variant === "pill") {
    return (
      <div
        className={cn("flex gap-1 p-1 bg-background rounded-lg border border-border w-fit", className)}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-surface text-primary shadow-sm border border-border"
                : "text-secondary hover:text-text"
            )}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center justify-center h-4.5 min-w-[1.125rem] rounded-full px-1 text-[10px] font-semibold",
                  activeTab === tab.id ? "bg-primary text-white" : "bg-[#e5e5e7] text-secondary"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Underline variant (default)
  return (
    <div className={cn("relative", className)}>
      <div
        role="tablist"
        className="flex gap-0 border-b border-border overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium",
              "transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary -mb-px"
                : "text-secondary hover:text-text"
            )}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center justify-center min-w-[1.125rem] h-[1.125rem] rounded-full px-1 text-[10px] font-semibold",
                  activeTab === tab.id ? "bg-primary text-white" : "bg-[#e5e5e7] text-secondary"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
