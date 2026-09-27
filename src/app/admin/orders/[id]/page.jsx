"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

const STATUS_OPTIONS = [
  "PENDING",
  "CONTACTED",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminOrderDetailPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [imeiAssignments, setImeiAssignments] = useState({});
  const [notes, setNotes] = useState("");

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data.order);
        setNewStatus(data.data.order.status);
        setNotes(data.data.order.notes || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          imeiAssignments,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data.order);
        alert(`Status pesanan berhasil diperbarui menjadi ${newStatus}.`);
        fetchOrder();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-text-secondary">Memuat data pesanan...</div>;
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h1 className="text-lg font-bold text-text mb-2">Pesanan Tidak Ditemukan</h1>
        <Link href="/admin/orders" className="text-xs font-semibold text-primary underline">
          ← Kembali ke Daftar Pesanan
        </Link>
      </div>
    );
  }

  // Calculate gross profit preview
  const totalCogs = order.items?.reduce((sum, item) => {
    const cost = Number(item.inventoryUnit?.purchasePrice || item.purchaseCost || 0);
    return sum + cost * item.quantity;
  }, 0) || 0;

  const grossProfit = Number(order.total) - totalCogs;

  // WhatsApp Contact URL for Customer
  const customerWa = order.customer?.whatsapp?.replace(/[^0-9]/g, "") || "";
  const waUrl = `https://wa.me/${customerWa.startsWith("0") ? "62" + customerWa.slice(1) : customerWa}?text=${encodeURIComponent(
    `Halo kak ${order.customer?.name}, kami dari CS Gamen Store mengonfirmasi pesanan #${order.orderNumber}. Status saat ini: ${ORDER_STATUS_LABELS[order.status] || order.status}. Ada yang bisa kami bantu?`
  )}`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-text-secondary mb-1">
            <Link href="/admin/orders" className="hover:underline">Pesanan</Link>
            <span>/</span>
            <span className="text-text font-medium">{order.orderNumber}</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-text">{order.orderNumber}</h1>
            <Badge variant={ORDER_STATUS_COLORS[order.status] || "default"}>
              {ORDER_STATUS_LABELS[order.status] || order.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {customerWa && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-success hover:bg-success-hover text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.531 1.761.78 2.796.78 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.776 0-3.447-.468-4.908-1.285l-5.092 1.347 1.371-4.997c-.886-1.503-1.371-3.238-1.371-5.065 0-5.518 4.482-10 10-10s10 4.482 10 10z" />
              </svg>
              Hubungi Pelanggan WA
            </a>
          )}
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-xl bg-surface-secondary text-text text-xs font-semibold hover:bg-border transition-colors"
          >
            ← Kembali
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Order Info & Items (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Customer & Delivery Card */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-text border-b border-border pb-2">Informasi Pemesan & Pengiriman</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-text-secondary block">Nama Lengkap:</span>
                <span className="font-bold text-text text-sm">{order.customer?.name}</span>
                <span className="text-text-secondary block mt-1">WhatsApp: {order.customer?.whatsapp}</span>
                {order.customer?.email && <span className="text-text-secondary block">Email: {order.customer?.email}</span>}
              </div>
              <div>
                <span className="text-text-secondary block">Metode Pengiriman:</span>
                <span className="font-semibold text-text">
                  {order.deliveryMethod === "PICKUP" ? "Ambil di Toko (Pickup)" : "Kirim ke Alamat (Delivery)"}
                </span>
                <span className="text-text-secondary block mt-1">Alamat:</span>
                <span className="font-medium text-text">{order.address || "-"}</span>
              </div>
            </div>
          </div>

          {/* Ordered Items & Unit IMEI Assignment */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-text border-b border-border pb-2">Rincian Item & Penetapan Unit Fisik (IMEI)</h2>
            <div className="space-y-4">
              {order.items?.map((item) => {
                const availableUnits = item.variant?.inventoryUnits || [];
                return (
                  <div key={item.id} className="p-4 rounded-xl bg-background border border-border/70 text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-text text-sm">{item.productNameSnapshot}</p>
                        <p className="text-text-secondary">
                          {item.variantSnapshot} · {item.quantity} Unit @ {formatCurrency(item.sellingPrice)}
                        </p>
                      </div>
                      <p className="font-bold text-text text-sm">{formatCurrency(item.total)}</p>
                    </div>

                    {/* Unit Assignment Selector */}
                    <div className="pt-2 border-t border-border/40">
                      <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                        Alokasi Unit IMEI Fisik:
                      </label>
                      {item.inventoryUnit ? (
                        <div className="flex items-center gap-2 text-success font-semibold">
                          <span>✓ Terkunci IMEI:</span>
                          <span className="font-mono bg-success/10 px-2 py-0.5 rounded text-[11px] text-text">
                            {item.inventoryUnit.imei}
                          </span>
                          <span className="text-[10px] text-text-secondary">
                            (Modal: {formatCurrency(item.inventoryUnit.purchasePrice)})
                          </span>
                        </div>
                      ) : availableUnits.length > 0 ? (
                        <select
                          value={imeiAssignments[item.id] || ""}
                          onChange={(e) =>
                            setImeiAssignments({ ...imeiAssignments, [item.id]: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text text-xs focus:outline-none font-mono"
                        >
                          <option value="">-- Pilih Unit IMEI dari Stok Ready --</option>
                          {availableUnits.map((u) => (
                            <option key={u.id} value={u.imei}>
                              {u.imei} (Kondisi: {u.condition}, BH: {u.batteryHealth || "-"}%, Modal: {formatCurrency(u.purchasePrice)})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-warning text-[11px] font-medium">
                          Tidak ada stok fisik ber-IMEI spesifik (akan menggunakan default modal varian saat diselesaikan).
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtotal / Shipping / Total Breakdown */}
            <div className="pt-3 border-t border-border space-y-1.5 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal Produk</span>
                <span className="text-text font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Ongkos Kirim</span>
                <span className="text-text font-medium">{formatCurrency(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-text pt-2 border-t border-border">
                <span>Total Pesanan</span>
                <span className="text-primary">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Status Lifecycle Stepper & Profit Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Update Card */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-text border-b border-border pb-2">Ubah Status Pesanan</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text uppercase mb-1">Status Baru</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st} — {ORDER_STATUS_LABELS[st] || st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text uppercase mb-1">Catatan Internal Toko</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan nomor resi / jadwal pickup..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={updating}
                className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
              >
                {updating ? "Menyimpan Status..." : "Simpan Perubahan Status"}
              </button>
            </div>

            <div className="p-3 bg-surface-secondary rounded-xl text-[10px] text-text-secondary space-y-1">
              <p>• <strong>CONFIRMED:</strong> Mereservasi unit stok.</p>
              <p>• <strong>COMPLETED:</strong> Mengurangi stok fisik, mencatat Penjualan & COGS otomatis di jurnal keuangan.</p>
              <p>• <strong>CANCELLED:</strong> Mengembalikan unit reservasi ke ready stock.</p>
            </div>
          </div>

          {/* Real-time Profit Preview Card */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-text border-b border-border pb-2">Estimasi Profit Pesanan</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Revenue Penjualan:</span>
                <span className="font-semibold text-text">{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Estimasi COGS (HPP):</span>
                <span className="font-semibold text-danger">-{formatCurrency(totalCogs)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-text pt-2 border-t border-border">
                <span>Gross Profit:</span>
                <span className="text-success">{formatCurrency(grossProfit)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
