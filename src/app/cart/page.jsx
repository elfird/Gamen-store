"use client";

import { useState } from "react";
import Link from "next/link";
import { StoreLayout, PageContainer } from "@/components/store";
import { useCart } from "@/context/CartContext";
import { formatCurrency, getWhatsAppUrl } from "@/lib/utils";
import { Button, Skeleton } from "@/components/ui";

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    estimatedShipping,
    isFreeShipping,
    freeShippingThreshold,
    total,
    isHydrated,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [isValidating, setIsValidating] = useState(false);
  const [stockNotice, setStockNotice] = useState(null);

  // Generate WhatsApp Direct Order Message from Cart Items
  const generateCartWhatsAppUrl = () => {
    let message = `Halo Admin Gamen Store, saya ingin memesan produk dari keranjang belanja:\n\n`;

    items.forEach((item, idx) => {
      message += `${idx + 1}. *${item.name}*\n` +
        `   • Varian: ${item.storage} - ${item.color} (SKU: ${item.sku})\n` +
        `   • Jumlah: ${item.quantity} unit x ${formatCurrency(item.price)}\n` +
        `   • Subtotal: ${formatCurrency(item.price * item.quantity)}\n\n`;
    });

    message += `💰 *Total Estimasi:* ${formatCurrency(total)}\n` +
      `📦 *Estimasi Ongkir:* ${isFreeShipping ? "Gratis Ongkir (Promo)" : formatCurrency(estimatedShipping)}\n\n` +
      `Mohon konfirmasi ketersediaan unit dan alamat pengiriman saya. Terima kasih!`;

    return getWhatsAppUrl(message);
  };

  // Revalidate Stock Handler
  const handleValidateStock = async () => {
    setIsValidating(true);
    setStockNotice(null);

    try {
      const res = await fetch("/api/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (data.hasAdjustments) {
        setStockNotice(
          "Beberapa stok atau harga telah disesuaikan berdasarkan data inventaris terbaru."
        );
      } else {
        setStockNotice("Seluruh item dalam keranjang tersedia dan siap diproses!");
      }
    } catch (err) {
      console.error("Failed to validate stock:", err);
    } finally {
      setIsValidating(false);
    }
  };

  // ─── Loading / Hydration State ──────────────────────────────────────────────
  if (!isHydrated) {
    return (
      <StoreLayout>
        <div className="py-10 sm:py-16 bg-white min-h-screen">
          <PageContainer>
            <div className="max-w-4xl mx-auto space-y-6">
              <Skeleton className="h-8 w-48 rounded-lg" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-4">
                  <Skeleton className="h-28 w-full rounded-2xl" />
                  <Skeleton className="h-28 w-full rounded-2xl" />
                </div>
                <div className="lg:col-span-4">
                  <Skeleton className="h-64 w-full rounded-2xl" />
                </div>
              </div>
            </div>
          </PageContainer>
        </div>
      </StoreLayout>
    );
  }

  // ─── Empty Cart State ───────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <StoreLayout>
        <div className="py-16 sm:py-24 bg-white min-h-[70vh] flex items-center">
          <PageContainer size="narrow">
            <div className="bg-[#F7F7F8] rounded-2xl p-8 sm:p-14 border border-[#E5E5E5] text-center">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#E5E5E5] flex items-center justify-center mx-auto text-[#737373] mb-5">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
                Keranjang Belanja Kosong
              </h1>
              <p className="mt-2 text-sm text-[#737373] max-w-md mx-auto leading-relaxed">
                Anda belum menambahkan produk ke dalam keranjang. Temukan unit iPhone atau aksesoris pilihan Anda.
              </p>

              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/products">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto px-7 rounded-xl bg-[#171717] text-white hover:bg-black">
                    Jelajahi Katalog Produk
                  </Button>
                </Link>
              </div>
            </div>
          </PageContainer>
        </div>
      </StoreLayout>
    );
  }

  // Calculate remaining for free shipping
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <StoreLayout>
      <div className="py-8 sm:py-14 bg-white min-h-screen">
        <PageContainer>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
                Keranjang Belanja
              </h1>
              <p className="text-xs sm:text-sm text-[#737373] mt-1">
                Terdapat <strong className="text-[#171717]">{itemCount} item</strong> dalam pesanan Anda.
              </p>
            </div>

            <button
              type="button"
              onClick={clearCart}
              className="text-xs text-[#DC2626] hover:text-[#B91C1C] font-semibold self-start sm:self-auto hover:underline"
            >
              Kosongkan Keranjang
            </button>
          </div>

          {/* Stock Notice Banner */}
          {stockNotice && (
            <div className="mb-6 p-4 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-between gap-3 text-xs text-[#2563EB]">
              <div className="flex items-center space-x-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span className="font-medium">{stockNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setStockNotice(null)}
                className="text-xs font-bold hover:underline"
              >
                Tutup
              </button>
            </div>
          )}

          {/* ─── 2-Column Desktop / Stacked Mobile Layout ────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* ─── Left Column: Cart Items List (8 cols) ─────────────────────── */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Progress Indicator */}
              <div className="p-4 rounded-xl bg-[#F7F7F8] border border-[#E5E5E5] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#171717]">
                    {isFreeShipping ? (
                      <span className="text-[#16A34A] font-bold">
                        Bebas Ongkos Kirim Aktif
                      </span>
                    ) : (
                      <span>
                        Tambah <strong className="text-[#171717]">{formatCurrency(remainingForFreeShipping)}</strong> lagi untuk Bebas Ongkir
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-[#737373]">{freeShippingProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16A34A] rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] divide-y divide-[#E5E5E5] overflow-hidden">
                {items.map((item) => {
                  const maxStock = item.availableStock || 99;
                  const isMaxReached = item.quantity >= maxStock;

                  return (
                    <div
                      key={item.variantId}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 hover:bg-[#F7F7F8]/40 transition-colors"
                    >
                      {/* Product Media & Info */}
                      <div className="flex items-start space-x-4 min-w-0">
                        {/* Thumbnail */}
                        <Link
                          href={`/products/${item.slug}`}
                          className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-[#F7F7F8] border border-[#E5E5E5] flex items-center justify-center p-2 shrink-0 hover:bg-[#EAEAEA] transition-colors"
                        >
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#171717]">
                            <rect x="5" y="2" width="14" height="20" rx="2" />
                            <line x1="12" y1="18" x2="12" y2="18.01" />
                          </svg>
                        </Link>

                        {/* Title & Metadata */}
                        <div className="space-y-1 min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            className="text-base font-bold text-[#171717] hover:underline transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>

                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#737373]">
                            <span className="font-semibold text-[#171717] bg-[#F7F7F8] px-2 py-0.5 rounded-md">
                              {item.storage}
                            </span>
                            <span>•</span>
                            <span>{item.color}</span>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-[#737373]">{item.sku}</span>
                          </div>

                          <p className="text-xs text-[#16A34A] font-medium pt-0.5">
                            {item.warranty || "Garansi Resmi Apple"}
                          </p>

                          <p className="text-sm font-bold text-[#171717] sm:hidden pt-1">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Stepper, Price & Remove */}
                      <div className="flex items-center justify-between sm:justify-end sm:space-x-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E5E5E5]">
                        {/* Stepper */}
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center border border-[#E5E5E5] rounded-lg bg-white p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="w-7 h-7 rounded flex items-center justify-center text-[#171717] hover:bg-[#F7F7F8] transition-colors"
                              aria-label="Kurangi jumlah"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-[#171717]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              disabled={isMaxReached}
                              className="w-7 h-7 rounded flex items-center justify-center text-[#171717] hover:bg-[#F7F7F8] disabled:opacity-30 transition-colors"
                              aria-label="Tambah jumlah"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Item Total Price */}
                        <div className="text-right hidden sm:block min-w-[120px]">
                          <span className="text-base font-bold text-[#171717] block">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[11px] text-[#737373] block">
                              @{formatCurrency(item.price)}
                            </span>
                          )}
                        </div>

                        {/* Remove Trash Button */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="p-2 rounded-lg text-[#737373] hover:text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors"
                          aria-label={`Hapus ${item.name} dari keranjang`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recheck Stock Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleValidateStock}
                  disabled={isValidating}
                  className="text-xs text-[#171717] hover:underline font-semibold disabled:opacity-50 inline-flex items-center space-x-1"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isValidating ? "animate-spin" : ""}>
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                  <span>{isValidating ? "Memeriksa stok..." : "Cek Ketersediaan Stok Real-Time"}</span>
                </button>
              </div>
            </div>

            {/* ─── Right Column: Order Summary (4 cols) ──────────────────────── */}
            <div className="lg:col-span-4 sticky lg:top-24 space-y-4">
              <div className="p-6 rounded-2xl bg-[#F7F7F8] border border-[#E5E5E5] space-y-5">
                <h2 className="text-base font-bold text-[#171717] tracking-tight border-b border-[#E5E5E5] pb-3">
                  Ringkasan Pesanan
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-[#737373]">
                    <span>Subtotal ({itemCount} unit)</span>
                    <span className="font-semibold text-[#171717]">{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#737373]">
                    <span>Estimasi Ongkir</span>
                    {isFreeShipping ? (
                      <span className="font-bold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded-md text-xs">
                        Bebas Ongkir
                      </span>
                    ) : (
                      <span className="font-semibold text-[#171717]">{formatCurrency(estimatedShipping)}</span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-base">
                    <span className="font-bold text-[#171717]">Total Pembayaran</span>
                    <span className="text-xl font-extrabold text-[#171717]">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {/* Checkout Actions */}
                <div className="space-y-2.5 pt-2">
                  <a
                    href={generateCartWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center space-x-2 h-11 px-6 rounded-xl bg-[#16A34A] text-white font-bold text-xs hover:bg-[#15803D] transition-all shadow-xs cursor-pointer"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>Pesan via WhatsApp</span>
                  </a>

                  <p className="text-[11px] text-[#737373] text-center leading-relaxed">
                    Pesanan akan dikonfirmasi langsung via WhatsApp bersama Admin Gamen Store.
                  </p>

                  <Link href="/checkout" className="block w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-9 rounded-xl border border-[#E5E5E5] text-[#171717] hover:bg-[#E5E5E5]/50 font-medium text-xs"
                    >
                      Isi Form Alamat Terlebih Dahulu
                    </Button>
                  </Link>

                  <Link href="/products" className="block text-center pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-[#737373] hover:text-[#171717]"
                    >
                      ← Lanjut Belanja Produk Lain
                    </Button>
                  </Link>
                </div>

                {/* Trust Assurance Strip */}
                <div className="pt-4 border-t border-[#E5E5E5] space-y-1.5 text-[11px] text-[#737373]">
                  <div className="flex items-center space-x-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Unit Original & IMEI Bebas Blokir</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Garansi Resmi & Proteksi Pengiriman</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    </StoreLayout>
  );
}
