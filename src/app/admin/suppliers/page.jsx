"use client";

import React, { useState, useEffect, useCallback } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [form, setForm] = useState({
    name: "",
    contactPerson: "",
    whatsapp: "",
    email: "",
    address: "",
    notes: "",
  });

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/api/admin/suppliers?limit=50";
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setSuppliers(data.data.suppliers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleOpenCreate = () => {
    setEditingSupplier(null);
    setForm({ name: "", contactPerson: "", whatsapp: "", email: "", address: "", notes: "" });
    setModalOpen(true);
  };

  const handleOpenEdit = (sup) => {
    setEditingSupplier(sup);
    setForm({
      name: sup.name,
      contactPerson: sup.contactPerson || "",
      whatsapp: sup.whatsapp || "",
      email: sup.email || "",
      address: sup.address || "",
      notes: sup.notes || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingSupplier ? `/api/admin/suppliers/${editingSupplier.id}` : "/api/admin/suppliers";
      const method = editingSupplier ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchSuppliers();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (sup) => {
    if (!confirm(`Ubah status supplier ${sup.name}?`)) return;
    try {
      await fetch(`/api/admin/suppliers/${sup.id}`, { method: "DELETE" });
      fetchSuppliers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Daftar Supplier Distributor</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Kelola mitra pengadaan unit iPhone, kontak penanggung jawab, dan total belanja modal.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-primary hover:bg-black text-primary-foreground text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Supplier Baru
        </button>
      </div>

      {/* Search */}
      <div className="bg-surface p-4 rounded-2xl border border-border flex gap-3 items-center justify-between shadow-2xs">
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari nama supplier, kontak, no WhatsApp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 border-b border-border text-text-secondary font-semibold">
              <tr>
                <th className="px-5 py-3.5">Supplier & PIC</th>
                <th className="px-4 py-3.5">Kontak WhatsApp</th>
                <th className="px-4 py-3.5">Total PO</th>
                <th className="px-4 py-3.5">Total Unit Dibeli</th>
                <th className="px-4 py-3.5">Total Belanja (Spending)</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-text-secondary">
                    Memuat daftar supplier...
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-text-secondary">
                    Tidak ada data supplier.
                  </td>
                </tr>
              ) : (
                suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-secondary/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-text text-sm">{s.name}</div>
                      <div className="text-[11px] text-text-secondary">PIC: {s.contactPerson || "-"}</div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-text">{s.whatsapp || s.email || "-"}</td>
                    <td className="px-4 py-3.5 text-text font-semibold">{s.totalPurchases || 0} PO</td>
                    <td className="px-4 py-3.5 text-text">{s.totalUnits || 0} Unit</td>
                    <td className="px-4 py-3.5 font-bold text-text">{formatCurrency(s.totalSpending || 0)}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={s.active ? "success" : "danger"}>
                        {s.active ? "Aktif" : "Non-aktif"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="text-primary hover:underline font-bold text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(s)}
                        className={`text-xs font-bold ${
                          s.active ? "text-danger hover:underline" : "text-success hover:underline"
                        }`}
                      >
                        {s.active ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Supplier Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-border p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-text">
                {editingSupplier ? "Edit Supplier" : "Tambah Supplier Baru"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-text-secondary hover:text-text">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text mb-1">Nama Supplier / PT *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="PT Sinar Apple Mandiri"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Nama PIC / Kontak</label>
                <input
                  type="text"
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  placeholder="Budi Wijaya"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Nomor WhatsApp</label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="081299887766"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="sales@supplier.com"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text mb-1">Alamat Gudang / Kantor</label>
                <textarea
                  rows="2"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Ruko Mangga Dua Mall Lt. 3..."
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
                  Simpan Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
