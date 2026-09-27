/**
 * Application-wide constants.
 * Business configuration should never be hardcoded in UI components.
 * All configurable values should be driven by environment variables or this file.
 */

// ─── Order Status ──────────────────────────────────────────────────────────────

export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONTACTED: "CONTACTED",
  CONFIRMED: "CONFIRMED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: "Pending",
  [ORDER_STATUS.CONTACTED]: "Dihubungi",
  [ORDER_STATUS.CONFIRMED]: "Dikonfirmasi",
  [ORDER_STATUS.PROCESSING]: "Diproses",
  [ORDER_STATUS.SHIPPED]: "Dikirim",
  [ORDER_STATUS.COMPLETED]: "Selesai",
  [ORDER_STATUS.CANCELLED]: "Dibatalkan",
};

/** Status badge color variants for ORDER_STATUS */
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: "warning",
  [ORDER_STATUS.CONTACTED]: "info",
  [ORDER_STATUS.CONFIRMED]: "info",
  [ORDER_STATUS.PROCESSING]: "info",
  [ORDER_STATUS.SHIPPED]: "primary",
  [ORDER_STATUS.COMPLETED]: "success",
  [ORDER_STATUS.CANCELLED]: "danger",
};

// ─── Inventory Status ──────────────────────────────────────────────────────────

export const INVENTORY_STATUS = {
  AVAILABLE: "AVAILABLE",
  RESERVED: "RESERVED",
  SOLD: "SOLD",
  RETURNED: "RETURNED",
  DAMAGED: "DAMAGED",
};

export const INVENTORY_STATUS_LABELS = {
  [INVENTORY_STATUS.AVAILABLE]: "Tersedia",
  [INVENTORY_STATUS.RESERVED]: "Direservasi",
  [INVENTORY_STATUS.SOLD]: "Terjual",
  [INVENTORY_STATUS.RETURNED]: "Dikembalikan",
  [INVENTORY_STATUS.DAMAGED]: "Rusak",
};

export const INVENTORY_STATUS_COLORS = {
  [INVENTORY_STATUS.AVAILABLE]: "success",
  [INVENTORY_STATUS.RESERVED]: "warning",
  [INVENTORY_STATUS.SOLD]: "primary",
  [INVENTORY_STATUS.RETURNED]: "info",
  [INVENTORY_STATUS.DAMAGED]: "danger",
};

// ─── Finance ───────────────────────────────────────────────────────────────────

export const FINANCE_TYPE = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
  CAPITAL: "CAPITAL",
};

export const FINANCE_CATEGORY = {
  // Income
  SALES: "SALES",
  SERVICE: "SERVICE",
  OTHER_INCOME: "OTHER_INCOME",
  // Capital
  CAPITAL: "CAPITAL",
  // Expense
  INVENTORY_PURCHASE: "INVENTORY_PURCHASE",
  OPERATIONAL: "OPERATIONAL",
  SHIPPING: "SHIPPING",
  MARKETING: "MARKETING",
  RENT: "RENT",
  UTILITIES: "UTILITIES",
  SALARY: "SALARY",
  TAX: "TAX",
  OTHER_EXPENSE: "OTHER_EXPENSE",
};

// ─── Product Condition ─────────────────────────────────────────────────────────

export const PRODUCT_CONDITION = {
  NEW: "NEW",
  LIKE_NEW: "LIKE_NEW",
  GOOD: "GOOD",
  FAIR: "FAIR",
};

export const PRODUCT_CONDITION_LABELS = {
  [PRODUCT_CONDITION.NEW]: "Baru",
  [PRODUCT_CONDITION.LIKE_NEW]: "Seperti Baru",
  [PRODUCT_CONDITION.GOOD]: "Baik",
  [PRODUCT_CONDITION.FAIR]: "Cukup",
};

// ─── Purchase Status ───────────────────────────────────────────────────────────

export const PURCHASE_STATUS = {
  DRAFT: "DRAFT",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
};

export const PURCHASE_STATUS_LABELS = {
  [PURCHASE_STATUS.DRAFT]: "Draft",
  [PURCHASE_STATUS.CONFIRMED]: "Dikonfirmasi",
  [PURCHASE_STATUS.CANCELLED]: "Dibatalkan",
};

// ─── Pagination ────────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ─── App Metadata ──────────────────────────────────────────────────────────────

export const APP_NAME = "Gamen Store";
export const APP_DESCRIPTION =
  "iPhone terpercaya dengan garansi resmi. Temukan iPhone terbaru dengan harga terbaik.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
