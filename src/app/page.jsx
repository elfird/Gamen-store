import Link from "next/link";
import { StoreLayout, PageContainer, SectionContainer } from "@/components/store";
import { Button, Badge, Card } from "@/components/ui";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: "Gamen Store — iPhone Specialist & Official Warranty",
  description:
    "Toko iPhone terpercaya dengan garansi resmi dan IMEI terdaftar Kemenperin. Dapatkan penawaran iPhone 16 & 15 Series terbaik.",
};

export default function HomePage() {
  const featuredModels = [
    {
      name: "iPhone 16 Pro Max",
      tagline: "Titanium. Begitu bertenaga. Begitu Pro.",
      badge: "Flagship Terbaru",
      price: "Mulai Rp 24.999.000",
      specs: ["Chip A18 Pro", "Camera Control", "Baterai Hingga 33 Jam", "Titanium Grade 5"],
      href: "/iphone?model=16-pro-max",
      highlight: true,
    },
    {
      name: "iPhone 16",
      tagline: "Kamera Fusion 48MP. Tombol Aksi Baru.",
      badge: "Populer",
      price: "Mulai Rp 16.499.000",
      specs: ["Chip A18", "Dynamic Island", "Kamera Fusion 48MP", "Desain Segar & Tangguh"],
      href: "/iphone?model=16",
      highlight: false,
    },
    {
      name: "iPhone 15 Pro Max",
      tagline: "Kamera Telephoto 5x. Desain Ringan & Kuat.",
      badge: "Best Value",
      price: "Mulai Rp 22.499.000",
      specs: ["Chip A17 Pro", "USB-C Kecepatan 3", "Action Button", "Layar ProMotion 120Hz"],
      href: "/iphone?model=15-pro-max",
      highlight: false,
    },
  ];

  return (
    <StoreLayout cartCount={0}>
      {/* ─── Hero Section ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#111111] text-white pt-16 pb-20 sm:pt-24 sm:pb-32">
        <PageContainer>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
              <span>Lineup iPhone 16 Series Resmi Hadir</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.1]">
              Kekuatan Pro. <br className="hidden sm:inline" />
              <span className="text-[#86868B]">Garansi Resmi Terpercaya.</span>
            </h1>

            <p className="text-base sm:text-xl text-[#A1A1A6] font-normal max-w-2xl mx-auto leading-relaxed">
              Dapatkan iPhone impian Anda dengan jaminan IMEI terdaftar permanen, unit bersegel original, dan konsultasi mudah langsung via WhatsApp.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link href="/iphone">
                <Button size="lg" className="w-full sm:w-auto bg-white text-[#111111] hover:bg-white/90 font-semibold px-8">
                  Jelajahi iPhone
                </Button>
              </Link>
              <Link href="/deals">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 px-8">
                  Lihat Promo & Deals
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ─── Featured Models Grid ────────────────────────────────────────────── */}
      <SectionContainer
        title="Model iPhone Unggulan"
        subtitle="Pilih seri iPhone yang sesuai dengan kebutuhan performa dan gaya hidup Anda."
        badge="Koleksi Pilihan"
        variant="muted"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {featuredModels.map((item, idx) => (
            <Card
              key={idx}
              className={`flex flex-col justify-between p-6 sm:p-8 rounded-3xl transition-all duration-200 hover:shadow-lg ${
                item.highlight ? "border-[#111111]/20 ring-1 ring-[#111111]/10 bg-white" : "bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={item.highlight ? "primary" : "secondary"}>
                    {item.badge}
                  </Badge>
                  <span className="text-xs font-semibold text-[#6E6E73]">Garansi 1 Thn</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] tracking-tight">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-[#6E6E73] leading-normal min-h-[40px]">
                  {item.tagline}
                </p>

                <div className="my-6 py-4 border-y border-[#D2D2D7]/50">
                  <span className="text-xs text-[#86868B] uppercase font-semibold tracking-wider">Mulai Dari</span>
                  <p className="text-xl font-bold text-[#111111] mt-0.5">{item.price}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {item.specs.map((spec, sIdx) => (
                    <li key={sIdx} className="flex items-center text-xs text-[#424245] space-x-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={item.href} className="w-full">
                <Button
                  variant={item.highlight ? "primary" : "secondary"}
                  className="w-full justify-center"
                >
                  Lihat Detail & Varian
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </SectionContainer>

      {/* ─── Why Gamen Store Banner ──────────────────────────────────────────── */}
      <SectionContainer variant="surface">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
              Kenapa Memilih Gamen Store?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight mt-2">
              Standar Transaksi iPhone yang Aman, Transparan, dan Tanpa Ribet
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-[#F5F5F7]">
              <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-[#1D1D1F]">IMEI Permanen & Legal</h4>
              <p className="mt-1 text-xs text-[#6E6E73] leading-relaxed">
                Seluruh unit terdaftar di Bea Cukai / Kemenperin. Bebas pemblokiran sinyal selamanya.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F5F5F7]">
              <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-[#1D1D1F]">Unit Fisik Terverifikasi</h4>
              <p className="mt-1 text-xs text-[#6E6E73] leading-relaxed">
                Pengecekan 30+ titik QC menyeluruh mulai dari layar, kamera, True Tone, Face ID, hingga Battery Health.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F5F5F7]">
              <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-[#1D1D1F]">Pemesanan Cepat via WhatsApp</h4>
              <p className="mt-1 text-xs text-[#6E6E73] leading-relaxed">
                Pilih varian, submit pesanan, dan lanjut konfirmasi langsung dengan staf profesional kami.
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* ─── Call To Action ──────────────────────────────────────────────────── */}
      <SectionContainer variant="dark">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
            Butuh Rekomendasi atau Cek Stok Fisik?
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1A6] leading-relaxed">
            Tim konsultan Gamen Store siap membantu Anda memilih seri iPhone, kapasitas storage, dan warna terbaik sesuai kebutuhan.
          </p>
          <div className="pt-2">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20Gamen%20Store,%20saya%20ingin%20konsultasi%20pembelian%20iPhone"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#16A34A] text-white font-semibold text-sm hover:bg-[#15803D] transition-all shadow-md hover:scale-105"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Hubungi Konsultan WhatsApp</span>
            </a>
          </div>
        </div>
      </SectionContainer>
    </StoreLayout>
  );
}
