"use client";

import { useState } from "react";
import Link from "next/link";
import { StoreLayout, PageContainer } from "@/components/store";
import { Button, Badge } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getWhatsAppUrl, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    const clean = orderNumber.trim();
    if (!clean) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal melacak pesanan.");
      }
      setResult(data.data);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memeriksa sistem.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const label = ORDER_STATUS_LABELS[status] || status;
    const variant = ORDER_STATUS_COLORS[status] || "default";
    return <Badge variant={variant} size="md">{label}</Badge>;
  };

  return (
    <StoreLayout>
      <div className="py-10 sm:py-16 bg-white min-h-screen">
        <PageContainer size="narrow">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs font-medium text-[#737373] mb-8">
            <Link href="/" className="hover:text-[#171717] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#171717] font-semibold">Lacak Pesanan</span>
          </nav>

          {/* Header */}
          <div className="space-y-3 mb-10 text-center max-w-xl mx-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F7F7F8] border border-[#E5E5E5] text-[#171717] text-[11px] font-semibold uppercase tracking-wider">
              Pelacakan Real-time
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Lacak Status Pesanan Anda
            </h1>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
              Pantau status pemrosesan pesanan iPhone Anda mulai dari konfirmasi, QC unit, hingga pengiriman dengan nomor resi resmi.
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-[#F7F7F8] rounded-2xl border border-[#E5E5E5] p-6 sm:p-10 mb-10">
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-2">
                  Nomor Pesanan (Order ID)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Contoh: ORD-20261026-0001"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white text-sm text-[#171717] font-mono placeholder:font-sans placeholder-[#A1A1A6] focus:outline-none focus:ring-1 focus:ring-[#171717] focus:border-[#171717] transition-all"
                  />
                  {orderNumber && (
                    <button
                      type="button"
                      onClick={() => setOrderNumber("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#171717] text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626] text-xs">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                size="lg"
                className="w-full rounded-xl text-xs font-bold py-3.5 bg-[#171717] text-white hover:bg-black transition-colors"
              >
                {loading ? "Melacak Pesanan..." : "Lacak Status Pesanan"}
              </Button>
            </form>
          </div>

          {/* Result Card */}
          {result && (
            <div className="mb-12">
              {result.found ? (
                <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E5E5]">
                    <div>
                      <span className="text-[11px] font-bold text-[#737373] uppercase tracking-wider block">
                        Order ID: {result.order.orderNumber}
                      </span>
                      <h3 className="text-lg font-bold text-[#171717]">
                        Pemesan: {result.order.customerName || "Pelanggan Terhormat"}
                      </h3>
                      <p className="text-xs text-[#737373]">
                        Dibuat pada: {formatDate(result.order.createdAt)}
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(result.order.status)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
                      Rincian Produk Pesanan:
                    </h4>
                    <div className="space-y-2">
                      {result.order.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-[#F7F7F8] border border-[#E5E5E5] flex items-center justify-between text-xs"
                        >
                          <div>
                            <strong className="text-[#171717] block font-semibold">{it.name}</strong>
                            <span className="text-[#737373]">{it.variant} • {it.quantity} unit</span>
                          </div>
                          <span className="font-bold text-[#171717]">
                            {formatCurrency(it.price * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-sm">
                    <span className="text-[#737373] font-medium">Total Tagihan:</span>
                    <strong className="text-base font-bold text-[#171717]">
                      {formatCurrency(result.order.total)}
                    </strong>
                  </div>

                  <div className="pt-2">
                    <a
                      href={getWhatsAppUrl(`Halo Admin Gamen Store, saya ingin konfirmasi pesanan dengan ID ${result.order.orderNumber}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                    >
                      <Button variant="secondary" size="md" className="w-full rounded-xl text-xs font-semibold bg-[#F7F7F8] border border-[#E5E5E5] text-[#171717] hover:bg-[#E5E5E5]">
                        Tanya Status Update via WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-[#F7F7F8] rounded-2xl border border-[#E5E5E5] p-8 text-center space-y-4">
                  <div className="w-10 h-10 rounded-full bg-[#171717]/5 text-[#171717] flex items-center justify-center mx-auto text-base font-bold">
                    !
                  </div>
                  <h3 className="text-base font-bold text-[#171717]">
                    Nomor Pesanan Tidak Ditemukan
                  </h3>
                  <p className="text-xs text-[#737373] max-w-md mx-auto leading-relaxed">
                    Pesanan dengan ID <code className="text-[#171717] font-semibold">{result.orderNumber}</code> tidak ditemukan. Pastikan format nomor pesanan sesuai seperti pada pesan WhatsApp Anda (contoh: <code>ORD-20261026-0001</code>).
                  </p>
                  <div className="pt-2">
                    <a
                      href={getWhatsAppUrl(`Halo Admin Gamen Store, saya kesulitan mencari nomor pesanan saya: ${result.orderNumber}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="primary" size="md" className="rounded-xl px-6 text-xs bg-[#171717] text-white hover:bg-black">
                        Bantu Cek via WhatsApp Admin
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </PageContainer>
      </div>
    </StoreLayout>
  );
}
