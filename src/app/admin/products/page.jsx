"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      let url = `/api/admin/products?page=${page}&limit=15`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (activeFilter !== "ALL") url += `&active=${activeFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, activeFilter]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const handleToggleArchive = async (id, currentActive) => {
    if (!confirm(currentActive ? "Arsipkan produk ini?" : "Aktifkan kembali produk ini?")) return;
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      });
      fetchProducts(pagination.page);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Katalog Produk</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Kelola model iPhone, varian kapasitas, warna, dan harga jual/beli.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 rounded-xl bg-primary hover:bg-black text-primary-foreground text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Produk Baru
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface p-4 rounded-2xl border border-border flex flex-col sm:flex-row gap-4 items-center justify-between shadow-2xs">
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari model iPhone, slug, atau SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-background text-text text-xs focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Diarsipkan (Non-aktif)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 border-b border-border text-text-secondary font-semibold">
              <tr>
                <th className="px-5 py-3.5">Produk</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Kondisi</th>
                <th className="px-4 py-3.5">Varian & Stok</th>
                <th className="px-4 py-3.5">Rentang Harga</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-text-secondary">
                    Memuat data katalog produk...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-text-secondary">
                    Tidak ada produk yang ditemukan.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const totalStock = prod.variants?.reduce((s, v) => s + v.stock, 0) || 0;
                  const minPrice = prod.variants?.length ? Math.min(...prod.variants.map((v) => Number(v.price))) : 0;
                  const maxPrice = prod.variants?.length ? Math.max(...prod.variants.map((v) => Number(v.price))) : 0;

                  return (
                    <tr key={prod.id} className="hover:bg-surface-secondary/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-text text-sm">{prod.name}</div>
                        <div className="text-[11px] text-text-secondary">
                          Model: {prod.model} · /{prod.slug}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-text-secondary">{prod.category?.name}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant="default">{prod.condition}</Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-text">{prod.variants?.length || 0} Varian</div>
                        <div className="text-[11px] text-text-secondary">Total: {totalStock} unit</div>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-text">
                        {minPrice === maxPrice
                          ? formatCurrency(minPrice)
                          : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={prod.active ? "success" : "danger"}>
                          {prod.active ? "Aktif" : "Diarsipkan"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleToggleArchive(prod.id, prod.active)}
                          className={`text-xs font-bold ${
                            prod.active ? "text-danger hover:underline" : "text-success hover:underline"
                          }`}
                        >
                          {prod.active ? "Arsipkan" : "Aktifkan"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
