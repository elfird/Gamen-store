"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems = [], subtotal = 0, clearCart, isHydrated } = useCart();

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    deliveryMethod: "DELIVERY", // 'DELIVERY' | 'PICKUP'
    province: "DKI Jakarta",
    city: "Jakarta Selatan",
    district: "Kebayoran Baru",
    postalCode: "12180",
    address: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const shippingCost = form.deliveryMethod === "DELIVERY" ? 0 : 0; // Free promo
  const total = subtotal + shippingCost;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (cartItems.length === 0) {
      setErrorMessage("Keranjang Anda kosong.");
      return;
    }

    if (!form.name.trim()) {
      setErrorMessage("Nama lengkap pemesan wajib diisi.");
      return;
    }

    if (!form.whatsapp.trim()) {
      setErrorMessage("Nomor WhatsApp wajib diisi.");
      return;
    }

    if (form.deliveryMethod === "DELIVERY" && !form.address.trim()) {
      setErrorMessage("Alamat lengkap pengiriman wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer: {
          name: form.name,
          whatsapp: form.whatsapp,
          email: form.email || null,
        },
        items: cartItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        deliveryMethod: form.deliveryMethod,
        shippingAddress: {
          province: form.province,
          city: form.city,
          district: form.district,
          postalCode: form.postalCode,
          address: form.address,
        },
        notes: form.notes,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat pesanan.");
      }

      // Order created successfully!
      const orderNumber = data.data.order.orderNumber;
      const whatsappUrl = data.data.whatsappUrl;

      // Clear local cart
      clearCart();

      // Open WhatsApp in new tab and redirect current tab to success screen
      if (typeof window !== "undefined") {
        window.open(whatsappUrl, "_blank");
        router.push(`/checkout/success?orderNumber=${orderNumber}`);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses pesanan.");
      setIsSubmitting(false);
    }
  };

  if (isHydrated && cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-surface-secondary flex items-center justify-center mb-6 text-text-secondary">
          <svg className="w-10 h-10 stroke-current fill-none stroke-1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text mb-3">
          Keranjang Belanja Kosong
        </h1>
        <p className="text-text-secondary max-w-md mb-8">
          Anda belum memilih produk untuk di-checkout. Silakan pilih iPhone impian Anda di katalog kami.
        </p>
        <Link
          href="/#featured"
          className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-black transition-colors"
        >
          Lihat Koleksi iPhone
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Checkout Breadcrumb / Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-3">
          <Link href="/" className="hover:text-text transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-text transition-colors">Keranjang</Link>
          <span>/</span>
          <span className="text-text font-medium">Checkout</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-text">Checkout Pesanan</h1>
        <p className="text-text-secondary text-sm mt-1">
          Lengkapi data pemesanan di bawah. Pembayaran dan konfirmasi akan dipandu langsung via WhatsApp.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm flex items-start gap-3">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span className="font-semibold block">Gagal Memproses Pesanan:</span>
            {errorMessage}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Customer & Delivery Info */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Customer Information */}
          <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-xs">
            <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</span>
              Informasi Kontak
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                  Nama Lengkap <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: Budi Santoso"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                    Nomor WhatsApp <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="Contoh: 081234567890"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                  />
                  <p className="text-[11px] text-text-secondary mt-1">
                    Digunakan untuk konfirmasi & invoice resmi.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                    Email (Opsional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Contoh: budi@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Delivery Method */}
          <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-xs">
            <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">2</span>
              Metode Pengambilan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  form.deliveryMethod === "DELIVERY"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border-hover bg-background"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-text text-sm flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    Kirim ke Alamat
                  </span>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="DELIVERY"
                    checked={form.deliveryMethod === "DELIVERY"}
                    onChange={handleChange}
                    className="accent-primary"
                  />
                </div>
                <p className="text-xs text-text-secondary">
                  Kurir berasuransi (JNE YES / Paxel / Instant GoSend). Garansi aman sampai tujuan.
                </p>
                <span className="mt-3 text-xs font-semibold text-success">Gratis Ongkir Promo</span>
              </label>

              <label
                className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  form.deliveryMethod === "PICKUP"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border-hover bg-background"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-text text-sm flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Ambil di Store (Pickup)
                  </span>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="PICKUP"
                    checked={form.deliveryMethod === "PICKUP"}
                    onChange={handleChange}
                    className="accent-primary"
                  />
                </div>
                <p className="text-xs text-text-secondary">
                  Gamen Store Storefront, Jl. Senopati No. 88, Jakarta Selatan. Cek unit langsung.
                </p>
                <span className="mt-3 text-xs font-semibold text-text">Bebas Biaya</span>
              </label>
            </div>
          </div>

          {/* 3. Address Details (Only if Delivery) */}
          {form.deliveryMethod === "DELIVERY" && (
            <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-text flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">3</span>
                Alamat Pengiriman
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                    Provinsi
                  </label>
                  <input
                    type="text"
                    name="province"
                    value={form.province}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                    Kota / Kabupaten
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                    Kecamatan
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-1.5">
                  Alamat Lengkap & Patokan <span className="text-danger">*</span>
                </label>
                <textarea
                  name="address"
                  rows="3"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, patokan lokasi..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
                ></textarea>
              </div>
            </div>
          )}

          {/* 4. Order Notes */}
          <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-xs">
            <h2 className="text-base font-bold text-text mb-2">Catatan Tambahan (Opsional)</h2>
            <textarea
              name="notes"
              rows="2"
              value={form.notes}
              onChange={handleChange}
              placeholder="Contoh: Tolong bungkus bubble wrap tebal, kirim sebelum jam 3 sore..."
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm resize-none"
            ></textarea>
          </div>
        </div>

        {/* Right Column: Order Summary & WhatsApp CTA */}
        <div className="lg:col-span-5">
          <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-sm sticky top-24 space-y-6">
            <h2 className="text-lg font-bold text-text pb-3 border-b border-border">
              Ringkasan Pesanan ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} Item)
            </h2>

            {/* Items List */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.variantId} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg bg-surface-secondary shrink-0 overflow-hidden border border-border/50">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name || "iPhone"}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-text-secondary">
                        iPhone
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs text-text truncate">{item.name}</p>
                    <p className="text-[11px] text-text-secondary">
                      {item.storage} · {item.color} · {item.quantity}x
                    </p>
                    <p className="text-xs font-bold text-text mt-0.5">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-border space-y-2.5 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal Produk</span>
                <span className="text-text font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Biaya Pengiriman</span>
                <span className="text-success font-semibold">
                  {form.deliveryMethod === "DELIVERY" ? "Gratis (Promo)" : "Bebas Biaya"}
                </span>
              </div>
              <div className="pt-3 border-t border-border flex justify-between items-baseline">
                <span className="font-bold text-text text-base">Total Pembayaran</span>
                <span className="text-xl font-bold text-text tracking-tight">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 text-xs text-text-secondary flex gap-2.5">
              <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Harga dan ketersediaan stok akan diverifikasi secara otomatis oleh sistem server saat tombol ditekan.
              </span>
            </div>

            {/* WhatsApp Checkout Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-success hover:bg-success-hover active:scale-[0.99] text-white font-bold flex items-center justify-center gap-2.5 shadow-md shadow-success/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  <span>Memverifikasi & Memproses...</span>
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.531 1.761.78 2.796.78 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.776 0-3.447-.468-4.908-1.285l-5.092 1.347 1.371-4.997c-.886-1.503-1.371-3.238-1.371-5.065 0-5.518 4.482-10 10-10s10 4.482 10 10z" />
                  </svg>
                  <span>Pesan Sekarang via WhatsApp</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-text-secondary">
              Setelah tombol ditekan, Anda akan diarahkan ke WhatsApp resmi Gamen Store dengan rincian pesanan.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
