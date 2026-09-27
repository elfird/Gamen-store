/**
 * UI Component Library — Gamen Store Design System
 *
 * All reusable UI primitives are exported from this file.
 * Import example:
 *   import { Button, Badge, Table, useToast } from "@/components/ui";
 */

// ─── Form ─────────────────────────────────────────────────────────────────────
export { default as Button } from "./Button";
export { default as Input } from "./Input";
export { default as Textarea } from "./Textarea";
export { default as Select } from "./Select";
export { default as Checkbox } from "./Checkbox";
export { default as Radio } from "./Radio";

// ─── Display ──────────────────────────────────────────────────────────────────
export { default as Badge } from "./Badge";
export { default as Card } from "./Card";
export { default as Alert } from "./Alert";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export { default as Skeleton, TableSkeleton, CardSkeleton } from "./Skeleton";

// ─── State ────────────────────────────────────────────────────────────────────
export { default as EmptyState } from "./EmptyState";
export { default as ErrorState } from "./ErrorState";
export { default as LoadingState } from "./LoadingState";

// ─── Overlays ─────────────────────────────────────────────────────────────────
export { default as Modal } from "./Modal";
export { default as Drawer } from "./Drawer";
export { default as Dropdown } from "./Dropdown";
export { default as ConfirmDialog } from "./ConfirmDialog";

// ─── Navigation ───────────────────────────────────────────────────────────────
export { default as Tabs } from "./Tabs";
export { default as Pagination } from "./Pagination";
export { default as Breadcrumb } from "./Breadcrumb";

// ─── Data ─────────────────────────────────────────────────────────────────────
export { default as Table } from "./Table";

// ─── Toast ────────────────────────────────────────────────────────────────────
// ToastProvider is registered in src/app/layout.jsx — do not re-wrap.
export { ToastProvider, useToast } from "./Toast";
