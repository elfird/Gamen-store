"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    model: "",
    categoryId: "",
    description: "",
    condition: "NEW",
    warranty: "1 Tahun Garansi Resmi",
    featured: false,
    active: true,
  });

  const [variants, setVariants] = useState([
    { sku: "", storage: "256GB", color: "Natural Titanium", price: 24999000, purchasePrice: 22000000, stock: 5 },
  ]);

  const [images, setImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/products?limit=1");
        const data = await res.json();
        if (data.success && data.data.categories) {
          setCategories(data.data.categories);
          if (data.data.categories.length > 0) {
            setForm((prev) => ({ ...prev, categoryId: data.data.categories[0].id }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { sku: "", storage: "512GB", color: "Black Titanium", price: 28999000, purchasePrice: 25000000, stock: 2 },
    ]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length === 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

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
        },
      ]);
    } catch (err) {
      setImageError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.slug || !form.model || !form.categoryId) {
      setError("Nama produk, slug, model, dan kategori wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          variants,
          images,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat produk.");
      }

      router.push("/admin/products");
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
            <Link href="/admin/products" className="hover:underline">Produk</Link>
            <span>/</span>
            <span className="text-text font-medium">Tambah Baru</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-text">Tambah Produk Baru</h1>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-text border-b border-border pb-2">Informasi Produk Utama</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">Nama Produk *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => {
                  const val = e.target.value;
                  const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
                  setForm({ ...form, name: val, slug: autoSlug });
                }}
                placeholder="iPhone 16 Pro Max"
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase mb-1">Slug URL *</label>
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
              <label className="block text-xs font-semibold text-text uppercase mb-1">Model / Nomor Seri *</label>
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
              <label className="block text-xs font-semibold text-text uppercase mb-1">Kategori *</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
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
                placeholder="1 Tahun Garansi Resmi"
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text uppercase mb-1">Deskripsi Lengkap</label>
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
              Tambahkan foto produk melalui URL gambar langsung atau upload jika Cloudinary terhubung.
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
                  placeholder="https://images.unsplash.com/... atau URL gambar lainnya"
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
              <label className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border bg-background hover:bg-surface-secondary text-text text-xs font-bold transition-colors cursor-pointer ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
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
              Belum ada foto yang ditambahkan. Masukkan URL gambar atau unggah file di atas.
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
                        e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='1.5'><rect width='18' height='18' x='3' y='3' rx='2'/><circle cx='8.5' cy='8.5' r='1.5'/><path d='m21 15-5-5L5 21'/></svg>";
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
                          ? "text-primary cursor-default"
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
              <p className="text-xs text-text-secondary">Kelola kombinasi kapasitas penyimpanan, warna, dan harga.</p>
            </div>
            <button
              type="button"
              onClick={handleAddVariant}
              className="px-3 py-1.5 rounded-lg bg-surface-secondary hover:bg-border text-text text-xs font-bold transition-colors"
            >
              + Tambah Varian
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-background border border-border/70 grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
                <div>
                  <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">SKU *</label>
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
                  <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">Storage *</label>
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
                  <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">Warna *</label>
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
                  <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">Harga Jual (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={v.price}
                    onChange={(e) => handleVariantChange(idx, "price", Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-surface text-text text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">Harga Modal Beli *</label>
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
                    <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">Stok Awal</label>
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
                      className="p-2 text-danger hover:bg-danger/10 rounded-lg shrink-0 mt-4"
                      title="Hapus varian"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 rounded-xl bg-surface-secondary text-text text-xs font-semibold hover:bg-border transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-black transition-colors disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Produk"}
          </button>
        </div>
      </form>
    </div>
  );
}
