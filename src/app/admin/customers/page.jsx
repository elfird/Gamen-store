"use client";

import React, { useState, useEffect, useCallback } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/api/admin/customers?limit=50";
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data.customers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleOpenDetail = async (c) => {
    try {
      const res = await fetch(`/api/admin/customers/${c.id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedCustomer(data.data.customer);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Daftar Pelanggan (Customers)</h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Data riwayat pembeli, total spending belanja, nomor kontak WhatsApp, dan alamat pengiriman.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-surface p-4 rounded-2xl border border-border flex gap-3 items-center justify-between shadow-2xs">
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari nama pelanggan, WhatsApp, email, kota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 border-b border-border text-text-secondary font-semibold">
              <tr>
                <th className="px-5 py-3.5">Nama Pelanggan</th>
                <th className="px-4 py-3.5">WhatsApp / Email</th>
                <th className="px-4 py-3.5">Kota / Lokasi</th>
                <th className="px-4 py-3.5">Total Pesanan</th>
                <th className="px-4 py-3.5">Total Spending</th>
                <th className="px-4 py-3.5">Pesanan Terakhir</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-text-secondary">
                    Memuat data pelanggan...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-text-secondary">
                    Tidak ada pelanggan ditemukan.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-text">{c.name}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-text">{c.whatsapp}</div>
                      {c.email && <div className="text-[11px] text-text-secondary">{c.email}</div>}
                    </td>
                    <td className="px-4 py-3.5 text-text-secondary">{c.city || c.province || "-"}</td>
                    <td className="px-4 py-3.5 text-text font-semibold">
                      {c.totalOrders || 0} ({c.completedOrdersCount || 0} Selesai)
                    </td>
                    <td className="px-4 py-3.5 font-bold text-text">{formatCurrency(c.totalSpending || 0)}</td>
                    <td className="px-4 py-3.5 text-text-secondary">
                      {c.lastOrder ? formatDate(c.lastOrder) : "-"}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDetail(c)}
                        className="text-primary hover:underline font-bold text-xs"
                      >
                        Detail
                      </button>
                      <a
                        href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, "").startsWith("0") ? "62" + c.whatsapp.replace(/[^0-9]/g, "").slice(1) : c.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-success hover:underline font-bold text-xs"
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-border p-6 max-w-lg w-full shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-text">{selectedCustomer.name}</h3>
                <p className="text-xs text-text-secondary font-mono">{selectedCustomer.whatsapp}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-text-secondary hover:text-text">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-background rounded-xl border border-border/70">
                <span className="font-bold text-text block mb-1">Alamat Pengiriman Utama:</span>
                <p className="text-text-secondary">{selectedCustomer.address || "-"}</p>
                <p className="text-text-secondary mt-0.5">
                  {[selectedCustomer.district, selectedCustomer.city, selectedCustomer.province, selectedCustomer.postalCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-text uppercase tracking-wider text-[11px] mb-2">
                  Riwayat Pesanan ({selectedCustomer.orders?.length || 0})
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedCustomer.orders?.map((ord) => (
                    <div key={ord.id} className="p-2.5 rounded-lg bg-background border border-border/50 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-text block">{ord.orderNumber}</span>
                        <span className="text-[10px] text-text-secondary">{formatDate(ord.createdAt)} · {ord.status}</span>
                      </div>
                      <span className="font-bold text-text">{formatCurrency(ord.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-surface-secondary text-text font-semibold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
