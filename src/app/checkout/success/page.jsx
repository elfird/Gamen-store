import React, { Suspense } from "react";
import Link from "next/link";
import { getOrderByOrderNumber, generateWhatsAppOrderMessage } from "@/services/order.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

async function SuccessContent({ searchParams }) {
  const params = await searchParams;
  const orderNumber = params?.orderNumber;

  if (!orderNumber) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-text mb-2">Nomor Pesanan Tidak Ditemukan</h1>
        <p className="text-text-secondary text-sm mb-6">Silakan periksa kembali tautan konfirmasi Anda.</p>
        <Link href="/" className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const order = await getOrderByOrderNumber(orderNumber);

  if (!order) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-text mb-2">Pesanan Tidak Ditemukan</h1>
        <p className="text-text-secondary text-sm mb-6">Pesanan dengan nomor {orderNumber} tidak terdaftar di sistem.</p>
        <Link href="/" className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const whatsappUrl = generateWhatsAppOrderMessage(order);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Success Badge & Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-success/10 text-success mx-auto flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text mb-2">
          Pesanan Berhasil Dibuat!
        </h1>
        <p className="text-text-secondary text-sm max-w-md mx-auto">
          Terima kasih telah berbelanja di Gamen Store. ID pesanan Anda adalah{" "}
          <strong className="text-text">{order.orderNumber}</strong>.
        </p>
      </div>

      {/* WhatsApp Action Alert */}
      <div className="p-6 bg-success/5 border border-success/20 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.531 1.761.78 2.796.78 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm9.969 5.766c0 5.518-4.482 10-10 10-1.776 0-3.447-.468-4.908-1.285l-5.092 1.347 1.371-4.997c-.886-1.503-1.371-3.238-1.371-5.065 0-5.518 4.482-10 10-10s10 4.482 10 10z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-text text-sm">Buka WhatsApp untuk Konfirmasi</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Jika jendela WhatsApp tidak terbuka otomatis, klik tombol di samping untuk mengirim rincian ke CS kami.
            </p>
          </div>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-success hover:bg-success-hover text-white text-xs font-bold shrink-0 text-center transition-colors"
        >
          Kirim via WhatsApp
        </a>
      </div>

      {/* Order Details Card */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <p className="text-xs text-text-secondary">Nomor Pesanan</p>
            <p className="font-bold text-text text-base">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Waktu Pemesanan</p>
            <p className="font-medium text-text text-sm">{formatDate(order.createdAt, "datetime")}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Status Pesanan</p>
            <Badge variant={ORDER_STATUS_COLORS[order.status] || "default"}>
              {ORDER_STATUS_LABELS[order.status] || order.status}
            </Badge>
          </div>
        </div>

        {/* Customer & Delivery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-background border border-border/60">
            <h4 className="font-bold text-text mb-1">Informasi Pemesan</h4>
            <p className="text-text-secondary">{order.customer?.name}</p>
            <p className="text-text-secondary">{order.customer?.whatsapp}</p>
            {order.customer?.email && <p className="text-text-secondary">{order.customer?.email}</p>}
          </div>
          <div className="p-4 rounded-xl bg-background border border-border/60">
            <h4 className="font-bold text-text mb-1">Metode & Alamat</h4>
            <p className="text-text-secondary font-medium">
              {order.deliveryMethod === "PICKUP" ? "Ambil di Toko (Pickup)" : "Pengiriman ke Alamat"}
            </p>
            <p className="text-text-secondary mt-1">{order.address || "-"}</p>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h4 className="font-bold text-text text-xs uppercase tracking-wider mb-3">Item Pesanan</h4>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-border/40 text-xs">
                <div>
                  <p className="font-semibold text-text">{item.productNameSnapshot}</p>
                  <p className="text-[11px] text-text-secondary">
                    {item.variantSnapshot} · {item.quantity}x @ {formatCurrency(item.sellingPrice)}
                  </p>
                </div>
                <p className="font-bold text-text">{formatCurrency(item.total)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="pt-2 space-y-1.5 text-xs">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>Ongkos Kirim</span>
            <span className="text-success font-medium">
              {Number(order.shippingCost) > 0 ? formatCurrency(order.shippingCost) : "Gratis"}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-border font-bold text-sm text-text">
            <span>Total Tagihan</span>
            <span className="text-base text-primary">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-xs font-semibold text-text-secondary hover:text-text underline">
          ← Kembali ke Katalog Toko
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage({ searchParams }) {
  return (
    <Suspense fallback={<div className="text-center py-20 text-sm text-text-secondary">Memuat data konfirmasi pesanan...</div>}>
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
