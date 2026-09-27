"use client";

import React, { useState, useEffect, useCallback } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export default function AdminFinancePage() {
  const [overview, setOverview] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    categoryId: "",
    type: "EXPENSE",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: "BANK_TRANSFER",
    reference: "",
    description: "",
  });

  const fetchFinanceData = useCallback(async () => {
    setLoading(true);
    try {
      let txUrl = "/api/admin/finance/transactions?limit=50";
      if (typeFilter !== "ALL") txUrl += `&type=${typeFilter}`;

      const [ovRes, txRes, catRes] = await Promise.all([
        fetch("/api/admin/finance"),
        fetch(txUrl),
        fetch("/api/admin/finance/categories"),
      ]);

      const ovData = await ovRes.json();
      const txData = await txRes.json();
      const catData = await catRes.json();

      if (ovData.success) setOverview(ovData.data);
      if (txData.success) setTransactions(txData.data.transactions || []);
      if (catData.success && catData.data.categories?.length > 0) {
        setCategories(catData.data.categories);
        if (!form.categoryId) {
          setForm((prev) => ({ ...prev, categoryId: catData.data.categories[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, form.categoryId]);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/finance/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setForm({
          categoryId: categories[0]?.id || "",
          type: "EXPENSE",
          amount: "",
          date: new Date().toISOString().slice(0, 10),
          paymentMethod: "BANK_TRANSFER",
          reference: "",
          description: "",
        });
        fetchFinanceData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Keuangan & Laba Rugi (Finance)</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Jurnal pembukuan kas, pemisahan mutasi modal vs pendapatan penjualan, serta perhitungan akurat COGS dan Gross Profit.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-primary hover:bg-black text-primary-foreground text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Catat Transaksi Kas
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-2xs">
          <span className="text-xs font-semibold text-text-secondary block">Revenue Penjualan (Sales)</span>
          <span className="text-xl font-bold text-text mt-1 block">
            {formatCurrency(overview?.salesRevenue || 0)}
          </span>
          <span className="text-[11px] text-text-secondary mt-1 block">Dari pesanan berstatus COMPLETED</span>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border shadow-2xs">
          <span className="text-xs font-semibold text-text-secondary block">Laba Kotor (Gross Profit)</span>
          <span className="text-xl font-bold text-success mt-1 block">
            {formatCurrency(overview?.grossProfit || 0)}
          </span>
          <span className="text-[11px] text-text-secondary mt-1 block">
            COGS Terjual: {formatCurrency(overview?.totalCogs || 0)}
          </span>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border shadow-2xs">
          <span className="text-xs font-semibold text-text-secondary block">Total Arus Kas Masuk (Inflow)</span>
          <span className="text-xl font-bold text-text mt-1 block">
            {formatCurrency(overview?.totalCashIn || 0)}
          </span>
          <span className="text-[11px] text-text-secondary mt-1 block">
            Termasuk modal: {formatCurrency(overview?.capitalInflow || 0)}
          </span>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border shadow-2xs">
          <span className="text-xs font-semibold text-text-secondary block">Net Cash Flow (Kas Bersih)</span>
          <span className={`text-xl font-bold mt-1 block ${(overview?.netCashFlow || 0) >= 0 ? "text-success" : "text-danger"}`}>
            {formatCurrency(overview?.netCashFlow || 0)}
          </span>
          <span className="text-[11px] text-text-secondary mt-1 block">Kas Masuk - Total Kas Keluar</span>
        </div>
      </div>

      {/* Accounting Rules Callout */}
      <div className="p-4 bg-surface rounded-2xl border border-border text-xs text-text-secondary grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <strong className="text-text block mb-0.5">1. Modal ≠ Omset Penjualan</strong>
          Setoran modal tercatat sebagai inflow kas, tetapi tidak dihitung sebagai pendapatan (revenue) toko.
        </div>
        <div>
          <strong className="text-text block mb-0.5">2. Kulakan Stok ≠ Beban Rugi</strong>
          Pembelian PO adalah pengeluaran kas menjadi aset inventaris. Beban dicatat sebagai COGS saat iPhone terjual.
        </div>
        <div>
          <strong className="text-text block mb-0.5">3. Gross Profit Realistis</strong>
          Gross Profit dihitung secara spesifik: <code>Harga Jual Unit - Modal Beli Asli IMEI</code>.
        </div>
      </div>

      {/* Transactions Table & Filters */}
      <div className="bg-surface rounded-2xl border border-border shadow-2xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-text">Buku Jurnal Kas Toko</h2>
          <div className="inline-flex p-1 bg-surface-secondary rounded-xl text-xs font-semibold">
            {[
              { id: "ALL", label: "Semua" },
              { id: "INCOME", label: "Pemasukan (Income)" },
              { id: "EXPENSE", label: "Pengeluaran (Expense)" },
              { id: "CAPITAL", label: "Modal (Capital)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  typeFilter === tab.id
                    ? "bg-surface text-text shadow-xs font-bold"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border text-text-secondary font-semibold">
              <tr>
                <th className="pb-3">Tanggal</th>
                <th className="pb-3">Tipe</th>
                <th className="pb-3">Kategori</th>
                <th className="pb-3">Deskripsi & Referensi</th>
                <th className="pb-3">Metode</th>
                <th className="pb-3 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-text-secondary">
                    Memuat jurnal transaksi...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-text-secondary">
                    Belum ada transaksi pada kategori ini.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="py-3 text-text-secondary">{formatDate(tx.date)}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          tx.type === "INCOME"
                            ? "success"
                            : tx.type === "CAPITAL"
                            ? "primary"
                            : "danger"
                        }
                      >
                        {tx.type}
                      </Badge>
                    </td>
                    <td className="py-3 font-semibold text-text">{tx.category?.name}</td>
                    <td className="py-3">
                      <div className="font-medium text-text">{tx.description}</div>
                      {tx.reference && <div className="text-[10px] text-text-secondary font-mono">Ref: {tx.reference}</div>}
                    </td>
                    <td className="py-3 text-text-secondary">{tx.paymentMethod}</td>
                    <td className={`py-3 font-bold text-right ${
                      tx.type === "EXPENSE" ? "text-danger" : "text-success"
                    }`}>
                      {tx.type === "EXPENSE" ? "-" : "+"}
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Transaction Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-border p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-text">Catat Transaksi Keuangan</h3>
              <button onClick={() => setModalOpen(false)} className="text-text-secondary hover:text-text">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1">Tipe Transaksi</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text focus:outline-none"
                >
                  <option value="EXPENSE">EXPENSE (Pengeluaran Operasional/Lainnya)</option>
                  <option value="INCOME">INCOME (Pemasukan Servis/Lainnya)</option>
                  <option value="CAPITAL">CAPITAL (Setoran Modal Pemilik)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Kategori Transaksi</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Nominal (Rp) *</label>
                <input
                  type="number"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Contoh: 1500000"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Tanggal Transaksi</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Metode Pembayaran</label>
                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text focus:outline-none"
                >
                  <option value="BANK_TRANSFER">Transfer Bank</option>
                  <option value="CASH">Tunai (Cash)</option>
                  <option value="E_WALLET">E-Wallet</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Nomor Referensi (Opsional)</label>
                <input
                  type="text"
                  value={form.reference}
                  onChange={(e) => setForm({ ...form, reference: e.target.value })}
                  placeholder="EXP-UTIL-0926"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Deskripsi & Keterangan *</label>
                <textarea
                  rows="2"
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Pembayaran tagihan listrik & WiFi store bulan September..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-secondary text-text font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-black"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
