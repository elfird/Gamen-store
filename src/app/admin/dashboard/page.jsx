"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState("all");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboard = useCallback(async (selectedPeriod) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/dashboard?period=${selectedPeriod}`);
      const data = await res.json();
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard(period);
  }, [period, fetchDashboard]);

  const kpis = dashboardData?.kpis || {};
  const tables = dashboardData?.tables || {};
  const charts = dashboardData?.charts || {};

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header & Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Dashboard Toko</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Ringkasan kinerja operasional, penjualan iPhone, dan valuasi aset toko.
          </p>
        </div>

        {/* Filter Presets */}
        <div className="inline-flex p-1 bg-surface rounded-xl border border-border text-xs font-semibold self-start sm:self-auto shadow-2xs">
          {[
            { id: "all", label: "Semua Waktu" },
            { id: "1y", label: "1 Tahun" },
            { id: "3m", label: "3 Bulan" },
            { id: "30d", label: "30 Hari" },
            { id: "7d", label: "7 Hari" },
            { id: "today", label: "Hari Ini" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                period === item.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── 1. KPI Metric Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Sales */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-text-secondary">Total Penjualan (Revenue)</span>
            <span className="p-1.5 rounded-lg bg-success/10 text-success">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </span>
          </div>
          <div className="text-xl font-bold text-text">
            {loading ? "..." : formatCurrency(kpis.totalSales || 0)}
          </div>
          <p className="text-[11px] text-text-secondary mt-1">Penjualan unit terealisasi</p>
        </div>

        {/* Card 2: Total Expenses */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-text-secondary">Total Pengeluaran Kas</span>
            <span className="p-1.5 rounded-lg bg-danger/10 text-danger">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </span>
          </div>
          <div className="text-xl font-bold text-text">
            {loading ? "..." : formatCurrency(kpis.totalExpenses || 0)}
          </div>
          <p className="text-[11px] text-text-secondary mt-1">Stok & operasional</p>
        </div>

        {/* Card 3: Gross Profit */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-text-secondary">Laba Kotor (Gross Profit)</span>
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="text-xl font-bold text-success">
            {loading ? "..." : formatCurrency(kpis.grossProfit || 0)}
          </div>
          <p className="text-[11px] text-text-secondary mt-1">Revenue dikurangi COGS unit</p>
        </div>

        {/* Card 4: Inventory Value */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-text-secondary">Nilai Aset Stok (Inventory)</span>
            <span className="p-1.5 rounded-lg bg-info/10 text-info">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </span>
          </div>
          <div className="text-xl font-bold text-text">
            {loading ? "..." : formatCurrency(kpis.inventoryValue || 0)}
          </div>
          <p className="text-[11px] text-text-secondary mt-1">{kpis.totalUnitsAvailable || 0} unit siap jual</p>
        </div>

        {/* Card 5: Pending Orders */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-text-secondary">Pesanan Pending</span>
            <span className="p-1.5 rounded-lg bg-warning/10 text-warning">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="text-xl font-bold text-text">
            {loading ? "..." : `${kpis.pendingOrdersCount || 0} Pesanan`}
          </div>
          <p className="text-[11px] text-text-secondary mt-1">Perlu konfirmasi WhatsApp</p>
        </div>
      </div>

      {/* ─── 2. Visual Charts & Summaries ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Timeline Card */}
        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-border shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-text">Tren Penjualan</h2>
              <p className="text-xs text-text-secondary">Distribusi nominal transaksi selesai</p>
            </div>
          </div>

          {charts.salesTimeline && charts.salesTimeline.length > 0 ? (
            <div className="h-44 flex items-end gap-3 pt-6 pb-2 border-b border-border">
              {charts.salesTimeline.map((pt, idx) => {
                const maxVal = Math.max(...charts.salesTimeline.map((p) => p.amount), 1);
                const heightPct = Math.round((pt.amount / maxVal) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="text-[9px] font-bold text-text opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                      {formatCurrency(pt.amount)}
                    </div>
                    <div
                      style={{ height: `${Math.max(15, heightPct)}%` }}
                      className="w-full bg-primary/80 group-hover:bg-primary rounded-t-md transition-all"
                    ></div>
                    <span className="text-[10px] text-text-secondary truncate w-full text-center">
                      {pt.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center text-xs text-text-secondary">
              Belum ada data penjualan pada rentang waktu ini.
            </div>
          )}
        </div>

        {/* Financial Flow Breakdown */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-text mb-1">Rasio Arus Kas & Margin</h2>
            <p className="text-xs text-text-secondary mb-4">Struktur perputaran dana toko</p>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-text-secondary">Total Kas Masuk (Inflow)</span>
                <span className="font-bold text-success">{formatCurrency(charts.incomeVsExpense?.income || 0)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-text-secondary">Total Kas Keluar (Outflow)</span>
                <span className="font-bold text-danger">{formatCurrency(charts.incomeVsExpense?.expense || 0)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span className="text-text-secondary">Net Cash Flow</span>
                <span className={`font-bold ${(charts.incomeVsExpense?.income || 0) >= (charts.incomeVsExpense?.expense || 0) ? "text-success" : "text-danger"}`}>
                  {formatCurrency(kpis.netCashFlow || 0)}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-text-secondary">Estimasi Laba Bersih (Net Profit)</span>
                <span className="font-bold text-primary">{formatCurrency(kpis.netProfit || 0)}</span>
              </div>
            </div>
          </div>

          <Link
            href="/admin/finance"
            className="w-full mt-4 py-2 px-3 rounded-xl bg-surface-secondary hover:bg-border text-text text-xs font-bold text-center transition-colors block"
          >
            Lihat Buku Kas Lengkap →
          </Link>
        </div>
      </div>

      {/* ─── 3. Tables: Recent Orders & Low Stock ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-surface rounded-2xl border border-border p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-text">Pesanan Terbaru</h2>
              <p className="text-xs text-text-secondary">Transaksi pesanan pelanggan terakhir masuk</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-semibold text-primary hover:underline">
              Semua Pesanan →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-secondary font-semibold">
                  <th className="pb-2.5">No. Pesanan</th>
                  <th className="pb-2.5">Pelanggan</th>
                  <th className="pb-2.5">Total</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {tables.recentOrders?.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-secondary/40">
                    <td className="py-2.5 font-bold text-text">{order.orderNumber}</td>
                    <td className="py-2.5 text-text-secondary">{order.customer?.name}</td>
                    <td className="py-2.5 font-medium text-text">{formatCurrency(order.total)}</td>
                    <td className="py-2.5">
                      <Badge variant={ORDER_STATUS_COLORS[order.status] || "default"}>
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-primary hover:underline font-bold text-[11px]"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (5 cols) */}
        <div className="lg:col-span-5 bg-surface rounded-2xl border border-border p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-text">Peringatan Stok Rendah</h2>
              <p className="text-xs text-text-secondary">Unit varian dengan sisa stok ≤ 3</p>
            </div>
            <Link href="/admin/inventory" className="text-xs font-semibold text-primary hover:underline">
              Kelola Stok →
            </Link>
          </div>

          <div className="space-y-3">
            {tables.lowStockVariants?.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border/60 text-xs">
                <div>
                  <p className="font-semibold text-text">{v.product?.name}</p>
                  <p className="text-[11px] text-text-secondary">
                    {v.storage} · {v.color} ({v.sku})
                  </p>
                </div>
                <div className="text-right">
                  <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                    v.stock === 0 ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"
                  }`}>
                    Sisa: {v.stock} unit
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
