"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function AdminEditProductPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    model: "",
    categoryId: "",
    description: "",
    condition: "NEW",
    warranty: "",
    featured: false,
    active: true,
  });

  const [variants, setVariants] = useState([]);
  const [deletedVariantIds, setDeletedVariantIds] = useState([]);

  // Images state
  const [images, setImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  // Load product data & categories
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/admin/products/${id}`),
          fetch(`/api/admin/products?limit=1`),
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (catData.success && catData.data.categories) {
          setCategories(catData.data.categories);
        }

        if (!prodRes.ok || !prodData.success) {
          throw new Error(prodData.error || "Gagal memuat data produk.");
        }

        const prod = prodData.data.product;
        setForm({
          name: prod.name || "",
          slug: prod.slug || "",
          model: prod.model || "",
          categoryId: prod.categoryId || "",
          description: prod.description || "",
          condition: prod.condition || "NEW",
          warranty: prod.warranty || "",
          featured: Boolean(prod.featured),
          active: Boolean(prod.active),
        });

        // Map variants
        if (prod.variants && prod.variants.length > 0) {
          setVariants(
            prod.variants.map((v) => ({
              id: v.id,
              sku: v.sku || "",
              storage: v.storage || "",
              color: v.color || "",
              price: Number(v.price),
              purchasePrice: Number(v.purchasePrice || 0),
              stock: Number(v.stock || 0),
              reservedStock: Number(v.reservedStock || 0),
              active: v.active !== undefined ? Boolean(v.active) : true,
            }))
          );
        } else {
          setVariants([]);
        }

        // Map images
        if (prod.images && prod.images.length > 0) {
          setImages(
            prod.images.map((img) => ({
              id: img.id,
              url: img.url,
              alt: img.alt || prod.name,
              isPrimary: Boolean(img.isPrimary),
              sortOrder: img.sortOrder || 0,
            }))
          );
        } else {
          setImages([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // Variant handlers
  const handleAddVariant = () => {
    const baseSku = form.model ? `IPH-${form.model.toUpperCase()}` : "VAR";
    const nextIndex = variants.length + 1;
    setVariants((prev) => [
      ...prev,
      {
        sku: `${baseSku}-${nextIndex}`,
        storage: "256GB",
        color: "Natural Titanium",
        price: 20000000,
        purchasePrice: 17000000,
        stock: 5,
        reservedStock: 0,
        active: true,
      },
    ]);
  };

  const handleRemoveVariant = (index) => {
    const target = variants[index];
    if (target.id) {
      setDeletedVariantIds((prev) => [...prev, target.id]);
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Image handlers
  const handleAddImageUrl = () => {
    setImageError("");
    const url = imageUrlInput.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      setImageError("Format URL tidak valid. Pastikan diawali http:// atau https://");
      return;
    }

    setImages((prev) => [
      ...prev,
      {
        url,
        alt: form.name || "Foto Produk",
        isPrimary: prev.length === 0,
        sortOrder: prev.length + 1,
      },
    ]);
    setImageUrlInput("");
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const removed = prev.filter((_, i) => i !== index);
      if (removed.length > 0 && !removed.some((img) => img.isPrimary)) {
        removed[0].isPrimary = true;
      }
      return removed;
    });
  };

  const handleSetPrimaryImage = (index) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleFileUpload = async (e) => {
    setImageError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("File yang dipilih harus berupa gambar (JPG, PNG, WebP).");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah foto.");
      }

      setImages((prev) => [
        ...prev,
        {
          url: data.data.url,
          alt: form.name || "Foto Produk",
          isPrimary: prev.length === 0,
          sortOrder: prev.length + 1,
        },
      ]);
    } catch (err) {
      setImageError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!form.name || !form.slug || !form.model || !form.categoryId) {
      setError("Nama produk, slug, model, dan kategori wajib diisi.");
      return;
    }

    if (variants.length === 0) {
      setError("Produk harus memiliki minimal satu varian.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          variants,
          deletedVariantIds,
          images,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memperbarui produk.");
      }

      setSuccessMsg("Perubahan produk berhasil disimpan!");
      setDeletedVariantIds([]);
      // Reload updated data if returned
      if (data.data?.product) {
        const prod = data.data.product;
        setVariants(
          prod.variants.map((v) => ({
            id: v.id,
            sku: v.sku,
            storage: v.storage,
            color: v.color,
            price: Number(v.price),
            purchasePrice: Number(v.purchasePrice || 0),
            stock: Number(v.stock || 0),
            reservedStock: Number(v.reservedStock || 0),
            active: Boolean(v.active),
          }))
        );
        if (prod.images) {
          setImages(
            prod.images.map((img) => ({
              id: img.id,
              url: img.url,
              alt: img.alt || prod.name,
              isPrimary: Boolean(img.isPrimary),
              sortOrder: img.sortOrder || 0,
            }))
          );
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-xs text-text-secondary">Memuat data produk...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-text-secondary mb-1">
            <Link href="/admin/products" className="hover:underline">
              Produk
            </Link>
            <span>/</span>
            <span className="text-text font-medium">Edit Produk</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-text">Edit Produk</h1>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                form.active
                  ? "bg-success/10 text-success border border-success/20"
                  : "bg-danger/10 text-danger border border-danger/20"
              }`}
            >
              {form.active ? "Aktif" : "Diarsipkan"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/products/${form.slug}`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl border border-border bg-surface hover:bg-surface-secondary text-text text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Lihat halaman storefront produk"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span>Preview Toko</span>
          </Link>
          <Link
            href="/admin/products"
            className="px-3.5 py-2 rounded-xl bg-surface-secondary hover:bg-border text-text text-xs font-semibold transition-colors"
          >
            Kembali
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-xs hover:underline">✕</button>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-success/10 border border-success/20 text-success rounded-xl text-xs font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {successMsg}
          </span>
          <button onClick={() => setSuccessMsg("")} className="text-xs hover:underline">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-sm font-bold text-text">Informasi Produk Utama</h2>
            <div className="flex items-center gap-4 text-xs font-semibold text-text">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-0"
                />
                <span>Produk Unggulan (Featured)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-0"
                />
                <span>Aktifkan di Toko</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">
                Nama Produk *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="iPhone 16 Pro Max"
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">
                Slug URL *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="iphone-16-pro-max"
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">
                Model / Nomor Seri *
              </label>
              <input
                type="text"
                required
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder="A3296"
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">
                Kategori *
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">Kondisi</label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
              >
                <option value="NEW">Baru (NEW)</option>
                <option value="LIKE_NEW">Seperti Baru (LIKE_NEW)</option>
                <option value="GOOD">Bekas Bagus (GOOD)</option>
                <option value="REFURBISHED">Refurbished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">Garansi</label>
              <input
                type="text"
                value={form.warranty}
                onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                placeholder="1 Tahun Garansi Resmi iBox"
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text uppercase mb-1">
              Deskripsi Lengkap
            </label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Spesifikasi dan keunggulan produk..."
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary resize-none"
            ></textarea>
          </div>
        </div>

        {/* Foto & Galeri Produk */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-2xs space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-sm font-bold text-text">Foto & Galeri Produk</h2>
            <p className="text-xs text-text-secondary">
              Kelola foto produk. Pilih foto utama yang akan ditampilkan pada etalase toko dan kartu produk.
            </p>
          </div>

          {imageError && (
            <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs font-semibold">
              {imageError}
            </div>
          )}

          {/* Add URL / Upload row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-8">
              <label className="block text-xs font-semibold text-text uppercase mb-1">
                URL Gambar Produk
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                  placeholder="https://images.unsplash.com/... atau URL gambar langsung"
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 rounded-xl bg-surface-secondary hover:bg-border text-text text-xs font-bold transition-colors shrink-0"
                >
                  + Tambah URL
                </button>
              </div>
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-text uppercase mb-1">
                Upload File (Cloudinary)
              </label>
              <label
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border bg-background hover:bg-surface-secondary text-text text-xs font-bold transition-colors cursor-pointer ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>{uploading ? "Mengunggah..." : "Pilih File Gambar"}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Image Previews */}
          {images.length === 0 ? (
            <div className="py-8 border border-dashed border-border rounded-xl text-center text-text-secondary text-xs">
              Belum ada foto produk. Masukkan URL gambar atau unggah file di atas.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`group relative rounded-xl border overflow-hidden bg-background transition-all ${
                    img.isPrimary ? "border-primary ring-2 ring-primary/20" : "border-border"
                  }`}
                >
                  <div className="aspect-square relative bg-white flex items-center justify-center p-2 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.alt || `Foto ${idx + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src =
                          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='1.5'><rect width='18' height='18' x='3' y='3' rx='2'/><circle cx='8.5' cy='8.5' r='1.5'/><path d='m21 15-5-5L5 21'/></svg>";
                      }}
                    />
                    {img.isPrimary && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold shadow-xs">
                        Foto Utama
                      </span>
                    )}
                  </div>

                  <div className="p-2 border-t border-border flex items-center justify-between bg-surface gap-1">
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-md transition-colors ${
                        img.isPrimary
                          ? "text-primary cursor-default font-extrabold"
                          : "text-text-secondary hover:text-text hover:bg-surface-secondary"
                      }`}
                    >
                      {img.isPrimary ? "★ Utama" : "Jadikan Utama"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="text-danger hover:bg-danger/10 p-1 rounded-md text-xs transition-colors"
                      title="Hapus foto"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variants Management */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div>
              <h2 className="text-sm font-bold text-text">Daftar Varian Produk</h2>
              <p className="text-xs text-text-secondary">
                Kelola kapasitas memori, varian warna, harga jual, harga modal, dan stok barang.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddVariant}
              className="px-3.5 py-1.5 rounded-lg bg-surface-secondary hover:bg-border text-text text-xs font-bold transition-colors"
            >
              + Tambah Varian
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div
                key={v.id || idx}
                className={`p-4 rounded-xl border transition-colors ${
                  v.active ? "bg-background border-border/70" : "bg-surface-secondary/50 border-border/40 opacity-75"
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                      SKU *
                    </label>
                    <input
                      type="text"
                      required
                      value={v.sku}
                      onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                      placeholder="IPH16PM-256-NAT"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                      Storage *
                    </label>
                    <input
                      type="text"
                      required
                      value={v.storage}
                      onChange={(e) => handleVariantChange(idx, "storage", e.target.value)}
                      placeholder="256GB"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                      Warna *
                    </label>
                    <input
                      type="text"
                      required
                      value={v.color}
                      onChange={(e) => handleVariantChange(idx, "color", e.target.value)}
                      placeholder="Natural Titanium"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                      Harga Jual (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      value={v.price}
                      onChange={(e) => handleVariantChange(idx, "price", Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                      Harga Modal (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      value={v.purchasePrice}
                      onChange={(e) => handleVariantChange(idx, "purchasePrice", Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                        Stok Fisik
                      </label>
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => handleVariantChange(idx, "stock", Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text text-xs focus:outline-none"
                      />
                    </div>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="p-2 text-danger hover:bg-danger/10 rounded-lg shrink-0 mt-4 transition-colors"
                        title="Hapus varian"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub row: Active Toggle & Reserved info */}
                <div className="mt-2.5 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] text-text-secondary">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={v.active}
                      onChange={(e) => handleVariantChange(idx, "active", e.target.checked)}
                      className="rounded border-border text-primary focus:ring-0"
                    />
                    <span>Varian Aktif untuk Penjualan</span>
                  </label>

                  {v.reservedStock > 0 && (
                    <span className="text-warning font-semibold">
                      ⚠️ {v.reservedStock} unit sedang dipesan (Reserved)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 rounded-xl bg-surface-secondary text-text text-xs font-semibold hover:bg-border transition-colors"
          >
            Batal & Kembali
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
