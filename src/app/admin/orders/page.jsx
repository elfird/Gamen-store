"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      let url = `/api/admin/orders?page=${page}&limit=20`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (statusFilter !== "ALL") url += `&status=${statusFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data.orders);
        setPagination(data.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Manajemen Pesanan (Orders)</h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Pantau pesanan pelanggan, konfirmasi status, reservasi unit IMEI, dan pembukuan hasil penjualan.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface p-4 rounded-2xl border border-border flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari No. Order, Nama Pelanggan, No WhatsApp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none w-full sm:w-auto"
        >
          <option value="ALL">Semua Status Pesanan</option>
          <option value="PENDING">PENDING (Menunggu Konfirmasi)</option>
          <option value="CONTACTED">CONTACTED (Sudah Dihubungi)</option>
          <option value="CONFIRMED">CONFIRMED (Unit Direservasi)</option>
          <option value="PROCESSING">PROCESSING (Diproses)</option>
          <option value="SHIPPED">SHIPPED (Dalam Pengiriman)</option>
          <option value="COMPLETED">COMPLETED (Selesai & Lunas)</option>
          <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 border-b border-border text-text-secondary font-semibold">
              <tr>
                <th className="px-5 py-3.5">No. Pesanan</th>
                <th className="px-4 py-3.5">Tanggal</th>
                <th className="px-4 py-3.5">Pelanggan</th>
                <th className="px-4 py-3.5">Rincian Item</th>
                <th className="px-4 py-3.5">Total Tagihan</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-text-secondary">
                    Memuat daftar pesanan...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-text-secondary">
                    Tidak ada pesanan yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-text">{o.orderNumber}</td>
                    <td className="px-4 py-3.5 text-text-secondary">{formatDate(o.createdAt, "datetime")}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-text">{o.customer?.name}</div>
                      <div className="text-[11px] text-text-secondary font-mono">{o.customer?.whatsapp}</div>
                    </td>
                    <td className="px-4 py-3.5 text-text-secondary">
                      {o.items?.map((it) => `${it.productNameSnapshot} (${it.quantity}x)`).join(", ")}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-text">{formatCurrency(o.total)}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={ORDER_STATUS_COLORS[o.status] || "default"}>
                        {ORDER_STATUS_LABELS[o.status] || o.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Kelola Pesanan →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
