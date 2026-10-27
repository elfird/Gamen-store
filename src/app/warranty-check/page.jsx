"use client";

import { useState } from "react";
import Link from "next/link";
import { StoreLayout, PageContainer } from "@/components/store";
import { Button, Badge } from "@/components/ui";
import { getWhatsAppUrl } from "@/lib/constants";

export default function WarrantyCheckPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCheck = async (e) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/warranty-check?imei=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memeriksa IMEI.");
      }
      setResult(data.data);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memeriksa database.");
    } finally {
      setLoading(false);
    }
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
            <span className="text-[#171717] font-semibold">Cek IMEI & Garansi</span>
          </nav>

          {/* Header */}
          <div className="space-y-3 mb-10 text-center max-w-xl mx-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[11px] font-semibold uppercase tracking-wider">
              Verifikasi Keaslian & Sinyal
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Cek IMEI & Status Garansi Resmi
            </h1>
            <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
              Verifikasi keaslian unit iPhone Gamen Store, riwayat legalitas IMEI Kemenperin/Bea Cukai, serta status garansi resmi perangkat Anda.
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-[#F7F7F8] rounded-2xl border border-[#E5E5E5] p-6 sm:p-10 mb-10">
            <form onSubmit={handleCheck} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-2">
                  Masukkan Nomor IMEI (15 Digit) atau Serial Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Contoh: 358940123456789 atau F17D1234..."
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] bg-white text-sm text-[#171717] font-mono placeholder:font-sans placeholder-[#A1A1A6] focus:outline-none focus:ring-1 focus:ring-[#171717] focus:border-[#171717] transition-all"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
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
                {loading ? "Memeriksa Database..." : "Verifikasi Status Unit"}
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#E5E5E5] text-[11px] sm:text-xs text-[#737373] flex items-center justify-between">
              <span>Cara cek IMEI di iPhone: Ketik <strong className="text-[#171717]">*#06#</strong> di panggilan telepon</span>
            </div>
          </div>

          {/* Result Card */}
          {result && (
            <div className="mb-12">
              {result.found ? (
                <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#E5E5E5]">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                        <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">
                          Unit Terverifikasi Resmi
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#171717]">
                        {result.productName}
                      </h3>
                    </div>
                    <Badge variant="success" size="md">
                      ORIGINAL
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#F7F7F8] border border-[#E5E5E5]">
                      <span className="text-[#737373] block mb-0.5">Model Apple</span>
                      <strong className="text-[#171717] font-semibold">{result.model}</strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F7F7F8] border border-[#E5E5E5]">
                      <span className="text-[#737373] block mb-0.5">Kapasitas</span>
                      <strong className="text-[#171717] font-semibold">{result.storage}</strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F7F7F8] border border-[#E5E5E5]">
                      <span className="text-[#737373] block mb-0.5">Warna</span>
                      <strong className="text-[#171717] font-semibold">{result.color}</strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F7F7F8] border border-[#E5E5E5]">
                      <span className="text-[#737373] block mb-0.5">Kondisi Fisik</span>
                      <strong className="text-[#171717] font-semibold">
                        {result.condition === "NEW" ? "Baru Segel (NEW)" : "Like New (Mulus)"}
                      </strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F7F7F8] border border-[#E5E5E5]">
                      <span className="text-[#737373] block mb-0.5">Battery Health</span>
                      <strong className="text-[#171717] font-semibold">{result.batteryHealth}</strong>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F7F7F8] border border-[#E5E5E5]">
                      <span className="text-[#737373] block mb-0.5">IMEI Terverifikasi</span>
                      <strong className="text-[#171717] font-mono">{result.imeiMasked}</strong>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#16A34A]/5 border border-[#16A34A]/20 text-[#16A34A] text-xs space-y-1">
                    <span className="font-bold block">Status Sinyal & Regulasi:</span>
                    <p className="text-[#171717]">{result.signalStatus}</p>
                    <p className="text-[11px] text-[#737373] mt-1">Garansi: {result.warranty}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#F7F7F8] rounded-2xl border border-[#E5E5E5] p-8 text-center space-y-4">
                  <div className="w-10 h-10 rounded-full bg-[#171717]/5 text-[#171717] flex items-center justify-center mx-auto text-base font-bold">
                    !
                  </div>
                  <h3 className="text-base font-bold text-[#171717]">
                    IMEI Belum Ditemukan di Database Otomatis
                  </h3>
                  <p className="text-xs text-[#737373] max-w-md mx-auto leading-relaxed">
                    Nomor IMEI atau Serial yang Anda masukkan (<code className="text-[#171717] font-semibold">{result.query}</code>) tidak terdaftar atau merupakan unit baru yang belum diarsip. Silakan hubungi admin kami untuk verifikasi manual via WhatsApp.
                  </p>
                  <div className="pt-2">
                    <a
                      href={getWhatsAppUrl(`Halo Admin Gamen Store, saya ingin cek keaslian IMEI: ${result.query}`)}
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

          {/* Guide section */}
          <div className="bg-[#F7F7F8] rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-[#171717] text-sm">
              Panduan Menemukan Nomor IMEI & Serial iPhone:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#737373]">
              <div className="p-4 rounded-xl bg-white border border-[#E5E5E5] space-y-1">
                <span className="font-bold text-[#171717] block">1. Melalui Menu Pengaturan:</span>
                <p>Buka <strong>Pengaturan (Settings)</strong> &gt; <strong>Umum (General)</strong> &gt; <strong>Mengenai (About)</strong>. Gulir ke bawah hingga menemukan kolom IMEI (15 digit).</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E5E5E5] space-y-1">
                <span className="font-bold text-[#171717] block">2. Melalui Kotak Kemasan / SIM Tray:</span>
                <p>Nomor IMEI dan Serial Number tertera jelas pada stiker barcode di bagian belakang box kemasan original dan pada dudukan slot kartu SIM fisik.</p>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    </StoreLayout>
  );
}
