import { clsx } from "clsx";

/**
 * Merge Tailwind class names safely.
 * @param {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Format a number as Indonesian Rupiah.
 * @param {number} amount
 * @param {Object} [options]
 * @param {boolean} [options.compact] - Use compact notation (e.g. 15jt)
 * @returns {string}
 */
export function formatCurrency(amount, options = {}) {
  if (amount === null || amount === undefined) return "Rp 0";
  const num = Number(amount);
  if (isNaN(num)) return "Rp 0";

  if (options.compact) {
    if (num >= 1_000_000_000) {
      return `Rp ${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, "")} M`;
    }
    if (num >= 1_000_000) {
      return `Rp ${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")} jt`;
    }
    if (num >= 1_000) {
      return `Rp ${(num / 1_000).toFixed(0)} rb`;
    }
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format a Date object or ISO string to a localized date string.
 * @param {Date|string} date
 * @param {Object} [options] - Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(date, options = {}) {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";

  const defaults = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("id-ID", { ...defaults, ...options }).format(d);
}

/**
 * Format a Date to a localized date-time string.
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDateTime(date) {
  return formatDate(date, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Generate a URL-friendly slug from a string.
 * @param {string} text
 * @returns {string}
 */
export function generateSlug(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Generate an order number with a date-based prefix.
 * Format: GS-YYYYMMDD-XXXXX
 * @returns {string}
 */
export function generateOrderNumber() {
  const now = new Date();
  const datePart = now
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `GS-${datePart}-${random}`;
}

/**
 * Generate a purchase number.
 * Format: PO-YYYYMMDD-XXXXX
 * @returns {string}
 */
export function generatePurchaseNumber() {
  const now = new Date();
  const datePart = now
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PO-${datePart}-${random}`;
}

/**
 * Truncate a string to a maximum length with ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 100) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Capitalize the first letter of a string.
 * @param {string} text
 * @returns {string}
 */
export function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convert a snake_case or UPPER_CASE string to Title Case.
 * Useful for displaying enum values.
 * @param {string} text
 * @returns {string}
 */
export function enumToLabel(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .split("_")
    .map(capitalize)
    .join(" ");
}

/**
 * Safely parse a JSON string. Returns null on failure.
 * @param {string} json
 * @returns {any}
 */
export function safeJsonParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Check if a value is a valid positive number.
 * @param {any} value
 * @returns {boolean}
 */
export function isPositiveNumber(value) {
  const num = Number(value);
  return !isNaN(num) && num > 0;
}

/**
 * Clamp a number between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
