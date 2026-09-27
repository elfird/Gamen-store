"use client";

import React, { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    storeName: "Gamen Store",
    storeDescription: "",
    whatsappNumber: "081234567890",
    email: "support@gamenstore.com",
    address: "",
    defaultShippingCost: 0,
    currency: "IDR",
    orderPrefix: "ORD",
    messageTemplate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success && data.data.settings) {
          setForm(data.data.settings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Pengaturan berhasil disimpan.");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-text-secondary">Memuat pengaturan toko...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Pengaturan Toko (Settings)</h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Konfigurasi identitas toko, nomor WhatsApp CS resmi, kebijakan pengiriman, dan template pesan.
        </p>
      </div>

      {message && (
        <div className="p-3 bg-success/10 border border-success/20 text-success rounded-xl text-xs font-semibold">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Store Information */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2">Informasi Toko</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">Nama Toko</label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">Email Dukungan</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text uppercase mb-1">Deskripsi Singkat Toko</label>
            <textarea
              rows="2"
              value={form.storeDescription}
              onChange={(e) => setForm({ ...form, storeDescription: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text uppercase mb-1">Alamat Showroom / Kantor Store</label>
            <textarea
              rows="2"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none resize-none"
            ></textarea>
          </div>
        </div>

        {/* 2. WhatsApp Integration */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2">Integrasi WhatsApp Pemesanan</h2>

          <div>
            <label className="block text-xs font-semibold text-text uppercase mb-1">Nomor WhatsApp Resmi Toko</label>
            <input
              type="tel"
              required
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              placeholder="081234567890"
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none"
            />
            <p className="text-[11px] text-text-secondary mt-1">
              Nomor yang akan menerima pesan otomatis dari pelanggan saat checkout selesai.
            </p>
          </div>
        </div>

        {/* 3. Commerce & Prefix */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2">Standar Transaksi</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">Prefix Nomor Order</label>
              <input
                type="text"
                value={form.orderPrefix}
                onChange={(e) => setForm({ ...form, orderPrefix: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">Mata Uang</label>
              <input
                type="text"
                disabled
                value={form.currency}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-surface-secondary text-text text-xs"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Menyimpan..." : "Simpan Semua Pengaturan"}
          </button>
        </div>
      </form>
    </div>
  );
}
