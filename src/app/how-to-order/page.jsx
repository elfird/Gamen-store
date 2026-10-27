import Link from "next/link";
import { StoreLayout, PageContainer } from "@/components/store";
import { Button } from "@/components/ui";
import { getWhatsAppUrl } from "@/lib/constants";

export const metadata = {
  title: "Panduan Pemesanan Cepat via WhatsApp | Gamen Store",
  description:
    "Cara mudah memesan iPhone impian di Gamen Store. Pilih unit, checkout otomatis di web, dan konfirmasi langsung dengan tim kami via WhatsApp.",
};

const STEPS = [
  {
    num: "01",
    title: "Pilih Model iPhone & Varian",
    desc: "Telusuri katalog produk kami, pilih kapasitas penyimpanan (128GB, 256GB, 512GB, 1TB) dan warna favorit Anda.",
    actionText: "Lihat Katalog",
    actionHref: "/products",
  },
  {
    num: "02",
    title: "Masukkan ke Keranjang & Checkout",
    desc: "Periksa kembali pesanan Anda di keranjang belanja, lalu klik tombol Checkout. Masukkan nama lengkap, nomor WhatsApp, dan alamat tujuan pengiriman.",
    actionText: "Buka Keranjang",
    actionHref: "/cart",
  },
  {
    num: "03",
    title: "Terhubung Otomatis ke WhatsApp Toko",
    desc: "Setelah menekan tombol 'Pesan via WhatsApp', sistem akan secara otomatis membuat nomor ID pesanan resmi dan membuka aplikasi WhatsApp dengan pesan pesanan yang sudah rapi.",
    actionText: null,
    actionHref: null,
  },
  {
    num: "04",
    title: "Inspeksi & Video QC Unit",
    desc: "Admin Gamen Store akan mengirimkan dokumentasi video fisik unit, tes layar, kamera, dan detail battery health sebelum pesanan dikemas.",
    actionText: null,
    actionHref: null,
  },
  {
    num: "05",
    title: "Pembayaran & Pengiriman Kilat Berasuransi",
    desc: "Lakukan pembayaran melalui transfer bank terpercaya. Pesanan Anda akan dikemas dengan bubble wrap tebal dan packing kayu berasuransi hingga tiba di depan pintu Anda.",
    actionText: null,
    actionHref: null,
  },
];

export default function HowToOrderPage() {
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
            <span className="text-[#171717] font-semibold">Panduan Pemesanan</span>
          </nav>

          {/* Header */}
          <div className="space-y-3 mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[11px] font-semibold uppercase tracking-wider">
              Simpel & Transparan
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Panduan Cara Pemesanan di Gamen Store
            </h1>
            <p className="text-sm text-[#737373] leading-relaxed">
              Tanpa perlu registrasi akun atau login yang membingungkan. Pesan langsung melalui antarmuka web modern dan lanjutkan interaksi personal bersama tim WhatsApp kami.
            </p>
          </div>

          {/* Steps Timeline */}
          <div className="space-y-4 mb-12">
            {STEPS.map((s, idx) => (
              <div
                key={idx}
                className="bg-[#F7F7F8] rounded-2xl border border-[#E5E5E5] p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-5 hover:border-[#171717]/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {s.num}
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-bold text-[#171717]">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                    {s.desc}
                  </p>
                  {s.actionText && (
                    <div className="pt-2">
                      <Link href={s.actionHref}>
                        <Button variant="secondary" size="sm" className="rounded-xl text-xs bg-white border border-[#E5E5E5] text-[#171717] hover:bg-[#F7F7F8]">
                          {s.actionText} →
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div className="bg-[#171717] text-white rounded-2xl p-8 sm:p-10 text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Siap Menemukan iPhone Impian Anda?
            </h3>
            <p className="text-xs sm:text-sm text-[#A1A1A6] max-w-md mx-auto leading-relaxed">
              Kunjungi katalog kami untuk melihat unit yang ready stock hari ini atau hubungi tim kami untuk konsultasi.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/products" className="w-full sm:w-auto">
                <Button variant="primary" size="md" className="w-full sm:w-auto rounded-xl px-7 bg-white text-[#171717] hover:bg-[#F7F7F8]">
                  Buka Katalog Produk
                </Button>
              </Link>
              <a
                href={getWhatsAppUrl("Halo Admin Gamen Store, saya ingin tanya cara order iPhone.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="md" className="w-full sm:w-auto rounded-xl px-7 border-white/20 text-white hover:bg-white/10">
                  Konsultasi WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </PageContainer>
      </div>
    </StoreLayout>
  );
}
