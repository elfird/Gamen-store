"use client";

import { useState } from "react";
import Link from "next/link";
import { StoreLayout, PageContainer } from "@/components/store";
import { Button } from "@/components/ui";
import { getWhatsAppUrl } from "@/lib/constants";

const FAQS = [
  {
    category: "Legalitas & Sinyal IMEI",
    items: [
      {
        q: "Apakah sinyal iPhone di Gamen Store dijamin aman seumur hidup?",
        a: "Ya, 100% aman permanen seumur hidup. Seluruh unit iPhone di Gamen Store adalah unit resmi berizin (resmi Indonesia seperti iBox/Digimap atau unit bea cukai resmi dengan pajak lunas terdaftar di database Kemenperin/Bea Cukai). Kami memberikan jaminan bebas blokir sinyal.",
      },
      {
        q: "Bagaimana cara memeriksa keaslian IMEI sebelum membeli?",
        a: "Anda dapat meminta nomor IMEI kepada admin kami atau mengeceknya langsung melalui halaman Cek IMEI & Garansi kami. Kami juga menyertakan nomor IMEI pada invoice resmi saat pesanan selesai dibuat.",
      },
      {
        q: "Apakah unit bisa menggunakan semua kartu SIM Indonesia?",
        a: "Tentu saja. Semua operator seluler GSM di Indonesia (Telkomsel, Indosat Ooredoo, XL Axiata, Smartfren, Tri, dan Live.On) dapat digunakan dengan lancar untuk jaringan 4G LTE maupun 5G.",
      },
    ],
  },
  {
    category: "Kondisi Fisik & Baterai",
    items: [
      {
        q: "Apa perbedaan kondisi 'Baru' (NEW) dan 'Like New'?",
        a: "Unit 'Baru' (NEW) adalah produk baru yang masih bersegel utuh dengan garansi resmi 1 tahun. Sementara unit 'Like New' adalah unit bekas pemakaian terawat dengan kemulusan fisik 95%-99%, seluruh fungsi normal 100%, dan bebas dari part kanibalan/rekondisi.",
      },
      {
        q: "Berapa kapasitas Battery Health untuk unit iPhone Like New?",
        a: "Seluruh unit Like New yang kami kurasi memiliki Battery Health prima (rata-rata 85% hingga 100%) dengan baterai original tanpa notifikasi baterai tidak dikenal.",
      },
      {
        q: "Apakah fitur Face ID dan TrueTone berfungsi normal?",
        a: "Ya, kami menjamin Face ID dan TrueTone berfungsi 100% normal. Setiap unit telah melalui pengujian 30+ tahapan Quality Control sebelum dikirim ke pelanggan.",
      },
    ],
  },
  {
    category: "Pengiriman & Pembayaran",
    items: [
      {
        q: "Bagaimana sistem pembayaran di Gamen Store?",
        a: "Kami menerima pembayaran melalui transfer bank resmi (BCA, Mandiri, BNI, BRI) atau e-wallet. Rekening resmi hanya diberikan langsung oleh Admin WhatsApp terverifikasi kami.",
      },
      {
        q: "Bagaimana keamanan pengiriman ke luar kota?",
        a: "Kami menggunakan jasa kurir ekspedisi terpercaya (JNE YES / SiCepat / J&T) dengan proteksi asuransi pengiriman penuh dan kemasan ekstra bubble wrap + packing kayu.",
      },
      {
        q: "Berapa lama estimasi pesanan sampai?",
        a: "Untuk wilayah Jabodetabek berkisar 1 hari kerja (tersedia pengiriman instan/sameday). Untuk kota-kota di pulau Jawa 1–2 hari kerja, dan luar pulau Jawa 2–4 hari kerja.",
      },
    ],
  },
  {
    category: "Garansi & Retur",
    items: [
      {
        q: "Berapa lama masa garansi toko Gamen Store?",
        a: "Unit Baru memiliki garansi resmi Apple selama 1 tahun. Untuk unit Like New, kami memberikan garansi toko tukar unit jika ditemukan kendala fungsional dalam masa garansi.",
      },
      {
        q: "Bagaimana prosedur klaim garansi jika terjadi kendala?",
        a: "Cukup hubungi Admin WhatsApp kami dengan menyebutkan nomor pesanan (misal: ORD-2026xxxx-xxxx) atau nomor IMEI unit. Tim kami akan memandu proses inspeksi dan penanganan kilat.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
            <span className="text-[#171717] font-semibold">Tanya Jawab (FAQ)</span>
          </nav>

          {/* Header */}
          <div className="space-y-3 mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F7F7F8] border border-[#E5E5E5] text-[#171717] text-[11px] font-semibold uppercase tracking-wider">
              Pusat Informasi
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Pertanyaan yang Sering Diajukan
            </h1>
            <p className="text-sm text-[#737373] leading-relaxed">
              Temukan jawaban cepat seputar keaslian produk, legalitas sinyal IMEI, pengiriman kilat, dan ketentuan garansi di Gamen Store.
            </p>
          </div>

          {/* Accordion Categories */}
          <div className="space-y-8 mb-14">
            {FAQS.map((category, catIdx) => (
              <div key={catIdx} className="space-y-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#171717] flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
                  <span>{category.category}</span>
                </h2>

                <div className="space-y-2.5">
                  {category.items.map((item, itemIdx) => {
                    const isOpen = Boolean(openItems[`${catIdx}-${itemIdx}`]);
                    return (
                      <div
                        key={itemIdx}
                        className="bg-[#F7F7F8] rounded-xl border border-[#E5E5E5] overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(catIdx, itemIdx)}
                          className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#171717] hover:bg-[#E5E5E5]/40 transition-colors"
                        >
                          <span>{item.q}</span>
                          <span className="text-base text-[#737373] shrink-0 font-mono">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-[#737373] leading-relaxed border-t border-[#E5E5E5]/60 bg-white">
                            <p className="pt-3">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Still Have Questions CTA */}
          <div className="bg-[#F7F7F8] rounded-2xl border border-[#E5E5E5] p-8 sm:p-10 text-center space-y-4">
            <h3 className="text-xl font-bold text-[#171717]">
              Punya Pertanyaan Lain yang Belum Terjawab?
            </h3>
            <p className="text-xs sm:text-sm text-[#737373] max-w-md mx-auto leading-relaxed">
              Customer Support kami siap membantu Anda secara langsung via chat WhatsApp dengan ramah dan cepat.
            </p>
            <div className="pt-2">
              <a
                href={getWhatsAppUrl("Halo Admin Gamen Store, saya ingin bertanya lebih lanjut seputar produk.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="md" className="rounded-xl px-7 bg-[#171717] text-white hover:bg-black">
                  Chat WhatsApp Customer Service
                </Button>
              </a>
            </div>
          </div>
        </PageContainer>
      </div>
    </StoreLayout>
  );
}
