"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * @typedef {{ id: string, title?: string, message: string, variant: "default"|"success"|"warning"|"danger"|"info", duration: number }} ToastItem
 */

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext(null);

// ─── Variant Config ───────────────────────────────────────────────────────────

const variantConfig = {
  default: {
    container: "bg-primary text-white border-white/10",
    icon: null,
  },
  success: {
    container: "bg-surface border-border text-text",
    icon: (
      <span className="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-success-light text-success">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M10 3L5 9 2 6" stroke="currentColor" strokeWidth="1.75"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    ),
  },
  warning: {
    container: "bg-surface border-border text-text",
    icon: (
      <span className="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-warning-light text-warning">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 4v3M6 8.5h.01" stroke="currentColor" strokeWidth="1.75"
            strokeLinecap="round" />
        </svg>
      </span>
    ),
  },
  danger: {
    container: "bg-surface border-border text-text",
    icon: (
      <span className="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-danger-light text-danger">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.75"
            strokeLinecap="round" />
        </svg>
      </span>
    ),
  },
  info: {
    container: "bg-surface border-border text-text",
    icon: (
      <span className="flex-shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-info-light text-info">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 5.5V8M6 3.5h.01" stroke="currentColor" strokeWidth="1.75"
            strokeLinecap="round" />
        </svg>
      </span>
    ),
  },
};

// ─── Single Toast Item Component ──────────────────────────────────────────────

function ToastItem({ toast, onDismiss }) {
  const timerRef = useRef(null);
  const config = variantConfig[toast.variant] ?? variantConfig.default;

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(timerRef.current);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 w-full min-w-[280px] max-w-sm rounded-lg border px-4 py-3 shadow-md",
        "animate-in slide-in-from-bottom-2 fade-in duration-200",
        config.container
      )}
    >
      {config.icon}

      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold leading-tight mb-0.5">{toast.title}</p>
        )}
        <p className="text-sm leading-relaxed">{toast.message}</p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Tutup notifikasi"
        className="shrink-0 rounded p-0.5 opacity-50 hover:opacity-100 transition-opacity focus:outline-none"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Wrap the app root layout with this provider to enable toasts.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /** @param {string} message @param {{ title?: string, variant?: string, duration?: number }} options */
  const toast = useCallback((message, options = {}) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        title: options.title,
        variant: options.variant ?? "default",
        duration: options.duration ?? 4500,
      },
    ]);
    return id;
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      {mounted &&
        createPortal(
          <div
            aria-live="polite"
            aria-label="Notifikasi"
            className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 items-end"
          >
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns { toast, dismiss } from the nearest ToastProvider.
 *
 * toast(message, { title, variant: "success"|"warning"|"danger"|"info"|"default", duration })
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}

export default ToastProvider;
