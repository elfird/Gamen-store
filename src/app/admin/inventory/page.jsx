"use client";

import React, { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";
import { INVENTORY_STATUS_LABELS, INVENTORY_STATUS_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

export default function AdminInventoryPage() {
  const [units, setUnits] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [conditionFilter, setConditionFilter] = useState("ALL");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Quick edit modal state
  const [editingUnit, setEditingUnit] = useState(null);
  const [editForm, setEditForm] = useState({ batteryHealth: "", condition: "GOOD", status: "AVAILABLE", notes: "" });

  const fetchInventory = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      let url = `/api/admin/inventory?page=${page}&limit=20`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (statusFilter !== "ALL") url += `&status=${statusFilter}`;
      if (conditionFilter !== "ALL") url += `&condition=${conditionFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setUnits(data.data.units);
        setStats(data.data.stats || {});
        setPagination(data.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, conditionFilter]);

  useEffect(() => {
    fetchInventory(1);
  }, [fetchInventory]);

  const handleOpenEdit = (unit) => {
    setEditingUnit(unit);
    setEditForm({
      batteryHealth: unit.batteryHealth || "",
      condition: unit.condition || "GOOD",
      status: unit.status || "AVAILABLE",
      notes: unit.notes || "",
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUnit) return;

    try {
      const res = await fetch(`/api/admin/inventory/${editingUnit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setEditingUnit(null);
        fetchInventory(pagination.page);
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Manajemen Inventaris & IMEI</h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Pelacakan unit fisik iPhone per IMEI, nomor seri, status ketersediaan, dan riwayat modal beli.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-surface p-4 rounded-xl border border-border">
          <p className="text-[11px] font-semibold text-text-secondary">Total Unit</p>
          <p className="text-lg font-bold text-text mt-0.5">{stats.totalUnits || 0}</p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-border">
          <p className="text-[11px] font-semibold text-success">Tersedia (Ready)</p>
          <p className="text-lg font-bold text-success mt-0.5">{stats.availableUnits || 0}</p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-border">
          <p className="text-[11px] font-semibold text-warning">Direservasi</p>
          <p className="text-lg font-bold text-warning mt-0.5">{stats.reservedUnits || 0}</p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-border">
          <p className="text-[11px] font-semibold text-primary">Terjual (Sold)</p>
          <p className="text-lg font-bold text-text mt-0.5">{stats.soldUnits || 0}</p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-border">
          <p className="text-[11px] font-semibold text-danger">Rusak / Retur</p>
          <p className="text-lg font-bold text-danger mt-0.5">{stats.damagedUnits || 0}</p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-border">
          <p className="text-[11px] font-semibold text-text-secondary">Valuasi Stok Ready</p>
          <p className="text-xs font-bold text-text mt-1 truncate">
            {formatCurrency(stats.inventoryValue || 0)}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface p-4 rounded-2xl border border-border flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari IMEI, Serial Number, SKU, Produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="AVAILABLE">AVAILABLE (Tersedia)</option>
            <option value="RESERVED">RESERVED (Dipesan)</option>
            <option value="SOLD">SOLD (Terjual)</option>
            <option value="RETURNED">RETURNED (Retur)</option>
            <option value="DAMAGED">DAMAGED (Rusak)</option>
          </select>

          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none"
          >
            <option value="ALL">Semua Kondisi</option>
            <option value="NEW">Baru (NEW)</option>
            <option value="LIKE_NEW">Like New</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
          </select>
        </div>
      </div>

      {/* Inventory Units Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 border-b border-border text-text-secondary font-semibold">
              <tr>
                <th className="px-4 py-3.5">IMEI / S/N</th>
                <th className="px-4 py-3.5">Produk & Varian</th>
                <th className="px-4 py-3.5">Kondisi & BH</th>
                <th className="px-4 py-3.5">Harga Modal</th>
                <th className="px-4 py-3.5">Harga Jual</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-text-secondary">
                    Memuat daftar unit inventaris...
                  </td>
                </tr>
              ) : units.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-text-secondary">
                    Tidak ada unit inventaris yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                units.map((unit) => (
                  <tr key={unit.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-text block">{unit.imei}</span>
                      <span className="text-[10px] text-text-secondary">SN: {unit.serialNumber || "-"}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-text">{unit.variant?.product?.name}</div>
                      <div className="text-[11px] text-text-secondary">
                        {unit.variant?.storage} · {unit.variant?.color} ({unit.variant?.sku})
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-text">{unit.condition}</span>
                        {unit.batteryHealth && (
                          <span className="px-1.5 py-0.5 rounded-md bg-success/10 text-success text-[10px] font-bold">
                            BH {unit.batteryHealth}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-text">
                      {formatCurrency(unit.purchasePrice)}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-text">
                      {unit.sellingPrice ? formatCurrency(unit.sellingPrice) : formatCurrency(unit.variant?.price || 0)}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant={INVENTORY_STATUS_COLORS[unit.status] || "default"}>
                        {INVENTORY_STATUS_LABELS[unit.status] || unit.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleOpenEdit(unit)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Edit Unit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Unit Modal */}
      {editingUnit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-border p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-sm text-text">Edit Unit Inventaris</h3>
                <p className="text-[11px] text-text-secondary font-mono">IMEI: {editingUnit.imei}</p>
              </div>
              <button onClick={() => setEditingUnit(null)} className="text-text-secondary hover:text-text">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1">Status Unit</label>
                <select
                  value={editForm.status}
                  disabled={editingUnit.status === "SOLD"}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text focus:outline-none"
                >
                  <option value="AVAILABLE">AVAILABLE (Tersedia Siap Jual)</option>
                  <option value="RESERVED">RESERVED (Direservasi Pesanan)</option>
                  <option value="SOLD">SOLD (Terjual)</option>
                  <option value="RETURNED">RETURNED (Retur Pelanggan)</option>
                  <option value="DAMAGED">DAMAGED (Rusak / Afkir)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Kondisi Fisik</label>
                <select
                  value={editForm.condition}
                  onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text focus:outline-none"
                >
                  <option value="NEW">Baru (NEW)</option>
                  <option value="LIKE_NEW">Seperti Baru (LIKE_NEW)</option>
                  <option value="GOOD">Bagus (GOOD)</option>
                  <option value="FAIR">Cukup (FAIR)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Battery Health (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.batteryHealth}
                  onChange={(e) => setEditForm({ ...editForm, batteryHealth: e.target.value })}
                  placeholder="Contoh: 95"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Catatan Unit</label>
                <textarea
                  rows="2"
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Kondisi kemasan, beacukai, dsb..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUnit(null)}
                  className="px-4 py-2 rounded-xl bg-surface-secondary text-text font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-black"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
