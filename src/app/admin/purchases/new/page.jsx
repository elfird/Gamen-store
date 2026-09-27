"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function AdminNewPurchasePage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    supplierId: "",
    purchaseDate: new Date().toISOString().slice(0, 10),
    invoiceNumber: "",
    paymentMethod: "BANK_TRANSFER",
    notes: "",
    status: "CONFIRMED", // Default CONFIRMED to immediately add stock and record expense
  });

  const [items, setItems] = useState([
    { variantId: "", quantity: 1, purchasePrice: 20000000, imei: "", serialNumber: "" },
  ]);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [supRes, prodRes] = await Promise.all([
          fetch("/api/admin/suppliers?limit=50"),
          fetch("/api/admin/products?limit=50"),
        ]);
        const supData = await supRes.json();
        const prodData = await prodRes.json();

        if (supData.success && supData.data.suppliers?.length > 0) {
          setSuppliers(supData.data.suppliers);
          setForm((prev) => ({ ...prev, supplierId: supData.data.suppliers[0].id }));
        }

        if (prodData.success && prodData.data.products?.length > 0) {
          setProducts(prodData.data.products);
          const firstVariant = prodData.data.products[0]?.variants?.[0];
          if (firstVariant) {
            setItems([
              {
                variantId: firstVariant.id,
                quantity: 1,
                purchasePrice: Number(firstVariant.purchasePrice || 20000000),
                imei: "",
                serialNumber: "",
              },
            ]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadInitialData();
  }, []);

  const allVariants = products.flatMap((p) =>
    (p.variants || []).map((v) => ({
      id: v.id,
      name: `${p.name} (${v.storage} - ${v.color})`,
      sku: v.sku,
      defaultPurchasePrice: Number(v.purchasePrice || 0),
    }))
  );

  const handleAddItem = () => {
    const firstV = allVariants[0];
    setItems((prev) => [
      ...prev,
      {
        variantId: firstV ? firstV.id : "",
        quantity: 1,
        purchasePrice: firstV ? firstV.defaultPurchasePrice : 20000000,
        imei: "",
        serialNumber: "",
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };

      if (field === "variantId") {
        const found = allVariants.find((v) => v.id === value);
        if (found && found.defaultPurchasePrice > 0) {
          next[index].purchasePrice = found.defaultPurchasePrice;
        }
      }
      return next;
    });
  };

  const totalAmount = items.reduce((sum, item) => sum + Number(item.purchasePrice || 0) * Number(item.quantity || 1), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.supplierId || items.length === 0) {
      setError("Pilih supplier dan tambahkan minimal 1 item pembelian.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mencatat pembelian.");
      }

      router.push(`/admin/purchases/${data.data.purchase.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <nav className="flex items-center gap-2 text-xs text-text-secondary mb-1">
            <Link href="/admin/purchases" className="hover:underline">Pembelian</Link>
            <span>/</span>
            <span className="text-text font-medium">Buat PO Baru</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-text">Catat Pembelian Stok Baru</h1>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier & Header */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2">Informasi Faktur & Supplier</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">Supplier Distributor *</label>
              <select
                value={form.supplierId}
                onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.contactPerson || "Admin"})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">Tanggal Pembelian *</label>
              <input
                type="date"
                required
                value={form.purchaseDate}
                onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">No. Invoice Supplier</label>
              <input
                type="text"
                value={form.invoiceNumber}
                onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                placeholder="INV-SUP-2026-XXXX"
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">Metode Pembayaran</label>
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
              >
                <option value="BANK_TRANSFER">Transfer Bank</option>
                <option value="CASH">Tunai (Cash)</option>
                <option value="E_WALLET">E-Wallet</option>
                <option value="OTHER">Lainnya</option>
              </select>
            </div>
          </div>
        </div>

        {/* Purchase Items */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div>
              <h2 className="text-sm font-bold text-text">Daftar Item & IMEI</h2>
              <p className="text-xs text-text-secondary">Pilih model iPhone yang dibeli, harga modal, dan nomor IMEI.</p>
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-border text-text text-xs font-bold transition-colors"
            >
              + Tambah Baris Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-background border border-border/70 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">Varian Produk *</label>
                  <select
                    value={item.variantId}
                    onChange={(e) => handleItemChange(idx, "variantId", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text text-xs focus:outline-none"
                  >
                    {allVariants.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">Qty *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text text-xs focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">Harga Beli Satuan (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={item.purchasePrice}
                    onChange={(e) => handleItemChange(idx, "purchasePrice", Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text text-xs focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">IMEI Fisik (Opsional)</label>
                  <input
                    type="text"
                    value={item.imei}
                    onChange={(e) => handleItemChange(idx, "imei", e.target.value)}
                    placeholder="358901234567890"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text text-xs focus:outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-end">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-2 text-danger hover:bg-danger/10 rounded-lg"
                      title="Hapus"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex justify-between items-center text-sm font-bold text-text">
            <span>Total Nilai Pembelian:</span>
            <span className="text-base text-primary">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/purchases"
            className="px-5 py-2.5 rounded-xl bg-surface-secondary text-text text-xs font-semibold hover:bg-border transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-black transition-colors disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Konfirmasi & Tambah Stok"}
          </button>
        </div>
      </form>
    </div>
  );
}
