"use client";

import React, { useState, useEffect, useCallback } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState("sales");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async (tab) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?type=${tab}`);
      const data = await res.json();
      if (data.success) {
        setReportData(data.data.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab, fetchReport]);

  const handleExportCSV = () => {
    if (!reportData) return;
    let csvContent = "data:text/csv;charset=utf-8,";

    if (activeTab === "sales" && reportData.orders) {
      csvContent += "No Order,Tanggal,Pelanggan,WhatsApp,Total (Rp),Status\n";
      reportData.orders.forEach((o) => {
        csvContent += `"${o.orderNumber}","${formatDate(o.createdAt)}","${o.customer?.name || ""}","${o.customer?.whatsapp || ""}",${o.total},"${o.status}"\n`;
      });
    } else if (activeTab === "purchases" && reportData.purchases) {
      csvContent += "No PO,Tanggal,Supplier,Total Biaya (Rp),Status\n";
      reportData.purchases.forEach((p) => {
        csvContent += `"${p.purchaseNumber}","${formatDate(p.purchaseDate)}","${p.supplier?.name || ""}",${p.totalAmount},"${p.status}"\n`;
      });
    } else {
      csvContent += `Laporan,${activeTab}\nExported,${new Date().toISOString()}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gamen-store-report-${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Laporan Bisnis & Analitik (Reports)</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Laporan penjualan, pembelian distributor, analisis laba rugi riil, dan kesehatan stok inventaris.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-surface-secondary hover:bg-border text-text text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Laporan (.CSV)
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border text-xs font-semibold space-x-6">
        {[
          { id: "sales", label: "Laporan Penjualan (Sales)" },
          { id: "purchases", label: "Laporan Pembelian (Purchases)" },
          { id: "profit", label: "Laporan Laba Rugi (P&L)" },
          { id: "inventory", label: "Laporan Inventaris (Stock)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-bold transition-colors border-b-2 cursor-pointer ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-text-secondary">Menghitung dan memuat laporan...</div>
      ) : (
        <div className="space-y-6">
          {/* 1. SALES REPORT */}
          {activeTab === "sales" && reportData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-surface p-4 rounded-xl border border-border">
                  <span className="text-xs text-text-secondary font-medium">Total Omset Penjualan</span>
                  <span className="text-xl font-bold text-text block mt-1">{formatCurrency(reportData.totalRevenue)}</span>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-border">
                  <span className="text-xs text-text-secondary font-medium">Pesanan Selesai</span>
                  <span className="text-xl font-bold text-success block mt-1">{reportData.completedOrdersCount} Pesanan</span>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-border">
                  <span className="text-xs text-text-secondary font-medium">Rata-rata Nilai Order (AOV)</span>
                  <span className="text-xl font-bold text-text block mt-1">{formatCurrency(reportData.averageOrderValue)}</span>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-border">
                  <span className="text-xs text-text-secondary font-medium">Pesanan Dibatalkan</span>
                  <span className="text-xl font-bold text-danger block mt-1">{reportData.cancelledOrdersCount} Pesanan</span>
                </div>
              </div>

              {/* Best Selling Products */}
              <div className="bg-surface p-6 rounded-2xl border border-border shadow-2xs space-y-3">
                <h3 className="text-sm font-bold text-text">Produk Terlaris (Best-Selling Models)</h3>
                <div className="space-y-2">
                  {reportData.bestSellingProducts?.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-background border border-border/60 text-xs">
                      <span className="font-semibold text-text">{p.name}</span>
                      <div className="text-right">
                        <span className="font-bold text-primary block">{p.unitsSold} Unit Terjual</span>
                        <span className="text-[11px] text-text-secondary">{formatCurrency(p.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. PURCHASE REPORT */}
          {activeTab === "purchases" && reportData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-surface p-4 rounded-xl border border-border">
                  <span className="text-xs text-text-secondary font-medium">Total Belanja Pengadaan</span>
                  <span className="text-xl font-bold text-text block mt-1">{formatCurrency(reportData.totalPurchaseValue)}</span>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-border">
                  <span className="text-xs text-text-secondary font-medium">Total Unit Masuk</span>
                  <span className="text-xl font-bold text-text block mt-1">{reportData.unitsPurchased} Unit</span>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-border">
                  <span className="text-xs text-text-secondary font-medium">Jumlah Faktur PO</span>
                  <span className="text-xl font-bold text-text block mt-1">{reportData.purchasesCount} PO Selesai</span>
                </div>
              </div>

              <div className="bg-surface p-6 rounded-2xl border border-border shadow-2xs space-y-3">
                <h3 className="text-sm font-bold text-text">Alokasi Belanja per Supplier Distributor</h3>
                <div className="space-y-2">
                  {reportData.supplierSpending?.map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-background border border-border/60 text-xs">
                      <span className="font-semibold text-text">{s.name}</span>
                      <span className="font-bold text-text">{formatCurrency(s.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. PROFIT REPORT */}
          {activeTab === "profit" && reportData && (
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-text border-b border-border pb-2">Laporan Laba Rugi Komprehensif (Income Statement)</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-border/60 font-semibold">
                  <span className="text-text">Pendapatan Penjualan (Revenue):</span>
                  <span className="text-text">{formatCurrency(reportData.revenue)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/60 font-semibold text-danger">
                  <span>Harga Pokok Penjualan (COGS Unit Terjual):</span>
                  <span>-{formatCurrency(reportData.totalCogs)}</span>
                </div>
                <div className="flex justify-between py-2.5 bg-success/5 px-3 rounded-xl font-bold text-sm text-success">
                  <span>Laba Kotor (Gross Profit):</span>
                  <span>{formatCurrency(reportData.grossProfit)} ({reportData.grossProfitMargin?.toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/60 font-semibold text-danger">
                  <span>Beban Operasional Toko (Sewa, Listrik, Iklan, Gaji):</span>
                  <span>-{formatCurrency(reportData.operationalExpenses)}</span>
                </div>
                <div className="flex justify-between py-3 bg-primary/5 px-3 rounded-xl font-bold text-base text-primary">
                  <span>Laba Bersih Toko (Net Profit):</span>
                  <span>{formatCurrency(reportData.netProfit)} ({reportData.netProfitMargin?.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. INVENTORY REPORT */}
          {activeTab === "inventory" && reportData && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-surface p-4 rounded-xl border border-border">
                  <span className="text-xs text-text-secondary font-medium">Stok Siap Jual</span>
                  <span className="text-xl font-bold text-success block mt-1">{reportData.stats?.availableUnits} Unit</span>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-border">
                  <span className="text-xs text-text-secondary font-medium">Stok Direservasi</span>
                  <span className="text-xl font-bold text-warning block mt-1">{reportData.stats?.reservedUnits} Unit</span>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-border">
                  <span className="text-xs text-text-secondary font-medium">Total Terjual</span>
                  <span className="text-xl font-bold text-text block mt-1">{reportData.stats?.soldUnits} Unit</span>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-border">
                  <span className="text-xs text-text-secondary font-medium">Valuasi Stok Ready</span>
                  <span className="text-xl font-bold text-text block mt-1">{formatCurrency(reportData.stats?.inventoryValue || 0)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
