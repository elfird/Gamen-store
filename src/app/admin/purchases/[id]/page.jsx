import React from "react";
import Link from "next/link";
import { getPurchaseById } from "@/services/purchase.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PURCHASE_STATUS_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export default async function AdminPurchaseDetailPage({ params }) {
  const { id } = await params;
  const purchase = await getPurchaseById(id);

  if (!purchase) {
    return (
      <div className="text-center py-16">
        <h1 className="text-xl font-bold text-text mb-2">Purchase Order Tidak Ditemukan</h1>
        <Link href="/admin/purchases" className="text-xs font-semibold text-primary underline">
          ← Kembali ke Daftar Pembelian
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-text-secondary mb-1">
            <Link href="/admin/purchases" className="hover:underline">Pembelian</Link>
            <span>/</span>
            <span className="text-text font-medium">{purchase.purchaseNumber}</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-text">{purchase.purchaseNumber}</h1>
            <Badge variant={purchase.status === "CONFIRMED" ? "success" : purchase.status === "DRAFT" ? "warning" : "danger"}>
              {PURCHASE_STATUS_LABELS[purchase.status] || purchase.status}
            </Badge>
          </div>
        </div>

        <Link
          href="/admin/purchases"
          className="px-4 py-2 rounded-xl bg-surface-secondary text-text text-xs font-semibold hover:bg-border transition-colors self-start sm:self-auto"
        >
          ← Kembali
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface p-5 rounded-2xl border border-border">
          <p className="text-xs font-semibold text-text-secondary">Distributor Supplier</p>
          <p className="text-base font-bold text-text mt-1">{purchase.supplier?.name}</p>
          <p className="text-xs text-text-secondary mt-0.5">Kontak: {purchase.supplier?.whatsapp || "-"}</p>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border">
          <p className="text-xs font-semibold text-text-secondary">Tanggal Faktur</p>
          <p className="text-base font-bold text-text mt-1">{formatDate(purchase.purchaseDate)}</p>
          <p className="text-xs text-text-secondary mt-0.5">No. Invoice: {purchase.invoiceNumber || "-"}</p>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border">
          <p className="text-xs font-semibold text-text-secondary">Total Biaya Pengadaan</p>
          <p className="text-xl font-bold text-text mt-1">{formatCurrency(purchase.totalAmount)}</p>
          <p className="text-xs text-success mt-0.5 font-medium">Metode: {purchase.paymentMethod}</p>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-text border-b border-border pb-2">Rincian Item Pembelian</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-text-secondary font-semibold">
                <th className="pb-2">Produk & Varian</th>
                <th className="pb-2">SKU</th>
                <th className="pb-2">Jumlah (Qty)</th>
                <th className="pb-2">Harga Beli Satuan</th>
                <th className="pb-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {purchase.items?.map((item) => (
                <tr key={item.id}>
                  <td className="py-2.5 font-semibold text-text">
                    {item.variant?.product?.name} ({item.variant?.storage} - {item.variant?.color})
                  </td>
                  <td className="py-2.5 font-mono text-text-secondary">{item.variant?.sku}</td>
                  <td className="py-2.5 text-text">{item.quantity} Unit</td>
                  <td className="py-2.5 text-text">{formatCurrency(item.purchasePrice)}</td>
                  <td className="py-2.5 font-bold text-text text-right">{formatCurrency(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Linked Inventory Units */}
      {purchase.inventoryUnits && purchase.inventoryUnits.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2">
            Unit Fisik Inventaris yang Terdaftar ({purchase.inventoryUnits.length} Unit)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {purchase.inventoryUnits.map((u) => (
              <div key={u.id} className="p-3 rounded-xl bg-background border border-border/70 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-bold text-text">{u.imei}</span>
                  <Badge variant={u.status === "AVAILABLE" ? "success" : "default"}>{u.status}</Badge>
                </div>
                <p className="text-[11px] text-text-secondary">Kondisi: {u.condition}</p>
                <p className="text-[11px] text-text-secondary">Modal: {formatCurrency(u.purchasePrice)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Finance Integration Note */}
      {purchase.transactions && purchase.transactions.length > 0 && (
        <div className="p-4 bg-success/5 border border-success/20 rounded-2xl text-xs flex items-center gap-3 text-text-secondary">
          <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center font-bold shrink-0">
            ✓
          </div>
          <div>
            <span className="font-bold text-text block">Tercatat di Jurnal Keuangan</span>
            Pengeluaran kas sebesar {formatCurrency(purchase.totalAmount)} telah otomatis dihubungkan ke modul finance.
          </div>
        </div>
      )}
    </div>
  );
}
