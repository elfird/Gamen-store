import Link from "next/link";
import { StoreLayout, PageContainer } from "@/components/store";
import { Button } from "@/components/ui";
import { getWhatsAppUrl } from "@/lib/constants";

export const metadata = {
  title: "Tentang Kami & Komitmen Kualitas | Gamen Store",
  description:
    "Gamen Store adalah destinasi terpercaya untuk membeli Apple iPhone original bergaransi resmi dengan jaminan sinyal permanen terdaftar Kemenperin.",
};

const QC_STEPS = [
  {
    title: "Layar & Tampilan TrueTone",
    desc: "Memastikan panel OLED original bawaan pabrik, touch responsif tanpa dead-pixel, dan fitur TrueTone aktif normal.",
  },
  {
    title: "Face ID & Sensor Biometrik",
    desc: "Sensor kamera TrueDepth dan Face ID berfungsi secepat kilat untuk keamanan autentikasi pengguna.",
  },
  {
    title: "Sinyal IMEI Permanen",
    desc: "IMEI terdaftar resmi di database Kemenperin / Bea Cukai. Jaminan sinyal aktif untuk semua operator GSM Indonesia seumur hidup.",
  },
  {
    title: "Kamera & Perekaman 4K",
    desc: "Uji fokus otomatis, stabilitas optik OIS, lensa Ultra-Wide, Telephoto zoom, audio spasial, dan Cinematic Mode.",
  },
  {
    title: "Kesehatan Baterai (Battery Health)",
    desc: "Kondisi baterai prima tanpa notifikasi part pengganti, mendukung pengisian daya cepat USB-PD.",
  },
  {
    title: "Speaker, Mic & Fitur Nirkabel",
    desc: "Suara stereo jernih, mic noise cancellation bekerja sempurna, serta konektivitas Wi-Fi, Bluetooth, dan AirDrop lancar.",
  },
];

export default function AboutPage() {
  return (
    <StoreLayout>
      <div className="py-10 sm:py-16 bg-white min-h-screen">
        <PageContainer>
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs font-medium text-[#737373] mb-8">
            <Link href="/" className="hover:text-[#171717] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#171717] font-semibold">Tentang Kami</span>
          </nav>

          {/* Hero Section */}
          <div className="max-w-3xl space-y-4 mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F7F7F8] border border-[#E5E5E5] text-[#171717] text-[11px] font-semibold uppercase tracking-wider">
              Tentang Gamen Store
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#171717] leading-tight">
              Standar Tertinggi Pengalaman Memiliki iPhone Impian Anda.
            </h1>
            <p className="text-sm sm:text-base text-[#737373] leading-relaxed">
              Gamen Store lahir dari dedikasi untuk menghadirkan perangkat Apple iPhone resmi, terkurasi, dan bebas dari rasa khawatir. Kami memastikan setiap unit iPhone yang sampai ke tangan Anda 100% original, bergaransi resmi, dan memiliki sinyal aman seumur hidup.
            </p>
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-[#F7F7F8] p-8 rounded-2xl border border-[#E5E5E5] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-[#171717]">100% Originalitas Teruji</h3>
              <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                Kami menolak keras unit rekondisi atau kanibalan. Semua part mulai dari layar, casing, hingga kamera adalah komponen asli standar Apple.
              </p>
            </div>

            <div className="bg-[#F7F7F8] p-8 rounded-2xl border border-[#E5E5E5] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-[#171717]">Legalitas & IMEI Kemenperin</h3>
              <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                Unit resmi iBox/GDN atau bea cukai resmi dengan pajak terbayar lunas. Bebas blokir sinyal seluler di seluruh operator Indonesia.
              </p>
            </div>

            <div className="bg-[#F7F7F8] p-8 rounded-2xl border border-[#E5E5E5] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#171717] text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-[#171717]">Layanan Konsultasi Personal</h3>
              <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                Pemesanan dipandu langsung oleh tim profesional via WhatsApp, lengkap dengan dokumentasi video unit sebelum dikirim.
              </p>
            </div>
          </div>

          {/* ─── Commitment Section (#commitment) ─── */}
          <section id="commitment" className="scroll-mt-24 mb-16">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 sm:p-12">
              <div className="max-w-2xl space-y-2 mb-10">
                <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">
                  Quality Control Ketat
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171717]">
                  Komitmen Kualitas & 30+ Titik Inspeksi Fisik
                </h2>
                <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">
                  Sebelum unit masuk ke inventaris dan dikirimkan ke pelanggan, teknisi bersertifikasi kami menjalankan serangkaian pengujian perangkat keras dan lunak secara komprehensif:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {QC_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-[#F7F7F8] border border-[#E5E5E5] space-y-2 hover:border-[#171717]/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                      <h4 className="text-sm font-bold text-[#171717]">{step.title}</h4>
                    </div>
                    <p className="text-xs text-[#737373] leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── Contact & Operational Hours (#contact) ─── */}
          <section id="contact" className="scroll-mt-24">
            <div className="bg-[#171717] text-white rounded-2xl p-8 sm:p-12 border border-[#171717]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-[#A1A1A6] text-xs font-semibold uppercase tracking-wider">
                    Lokasi & Jam Operasional
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                    Butuh Bantuan atau Ingin Bertanya Stok?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#A1A1A6] leading-relaxed max-w-lg">
                    Tim Customer Service kami siap melayani Anda setiap hari untuk konsultasi spesifikasi iPhone, estimasi tukar tambah, dan pengiriman aman ke kota Anda.
                  </p>

                  <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-[#D2D2D7]">
                    <div className="flex items-start space-x-3">
                      <span className="font-semibold text-white shrink-0">Alamat:</span>
                      <span>Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan, 12190</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="font-semibold text-white shrink-0">Jam Layanan:</span>
                      <span>Senin – Minggu: 09.00 – 21.00 WIB (Setiap Hari)</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="font-semibold text-white shrink-0">Respon Chat:</span>
                      <span className="text-[#16A34A] font-semibold">&lt; 5 Menit via WhatsApp CS</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                  <a
                    href={getWhatsAppUrl("Halo Admin Gamen Store, saya ingin tanya stok dan promo iPhone.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-[#16A34A] text-white font-bold text-sm hover:bg-[#15803D] transition-all text-center"
                  >
                    <span>Hubungi Admin via WhatsApp</span>
                  </a>
                  <Link href="/products">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl"
                    >
                      Jelajahi Katalog iPhone
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </PageContainer>
      </div>
    </StoreLayout>
  );
}
