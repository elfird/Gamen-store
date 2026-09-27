"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PURCHASE_STATUS_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchPurchases = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      let url = `/api/admin/purchases?page=${page}&limit=20`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (statusFilter !== "ALL") url += `&status=${statusFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPurchases(data.data.purchases);
        setPagination(data.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchPurchases(1);
  }, [fetchPurchases]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Pembelian Stok (Purchases)</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Kelola faktur kulakan dari supplier distributor, pencatatan biaya masuk, dan integrasi stok otomatis.
          </p>
        </div>
        <Link
          href="/admin/purchases/new"
          className="px-4 py-2.5 rounded-xl bg-primary hover:bg-black text-primary-foreground text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Buat Pembelian Baru
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface p-4 rounded-2xl border border-border flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari No. Pembelian, No. Invoice, Supplier..."
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
          <option value="ALL">Semua Status</option>
          <option value="DRAFT">DRAFT (Belum Dikonfirmasi)</option>
          <option value="CONFIRMED">CONFIRMED (Stok Masuk)</option>
          <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
        </select>
      </div>

      {/* Purchases Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 border-b border-border text-text-secondary font-semibold">
              <tr>
                <th className="px-5 py-3.5">No. Pembelian</th>
                <th className="px-4 py-3.5">Tanggal</th>
                <th className="px-4 py-3.5">Supplier</th>
                <th className="px-4 py-3.5">Jumlah Item</th>
                <th className="px-4 py-3.5">Total Biaya</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-text-secondary">
                    Memuat riwayat pembelian...
                  </td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-text-secondary">
                    Tidak ada purchase order ditemukan.
                  </td>
                </tr>
              ) : (
                purchases.map((p) => {
                  const totalUnits = p.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                  return (
                    <tr key={p.id} className="hover:bg-surface-secondary/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-text block">{p.purchaseNumber}</span>
                        {p.invoiceNumber && (
                          <span className="text-[10px] text-text-secondary">Inv: {p.invoiceNumber}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-text-secondary">{formatDate(p.purchaseDate)}</td>
                      <td className="px-4 py-3.5 font-semibold text-text">{p.supplier?.name}</td>
                      <td className="px-4 py-3.5 text-text-secondary">
                        {p.items?.length || 0} Model ({totalUnits} Unit)
                      </td>
                      <td className="px-4 py-3.5 font-bold text-text">{formatCurrency(p.totalAmount)}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant={p.status === "CONFIRMED" ? "success" : p.status === "DRAFT" ? "warning" : "danger"}>
                          {PURCHASE_STATUS_LABELS[p.status] || p.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/admin/purchases/${p.id}`}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          Detail PO →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
