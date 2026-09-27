import Link from "next/link";
import {
  StoreLayout,
  PageContainer,
  SectionContainer,
} from "@/components/store";
import { ProductCard } from "@/components/products";
import { Button, Badge, EmptyState } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import {
  getFeaturedProducts,
  getLatestProducts,
  getModelsOverview,
} from "@/services/product.service";

export const metadata = {
  title: "Find Your Next iPhone | Gamen Store",
  description:
    "Discover selected iPhone models with trusted quality and a simple ordering experience. Garansi resmi, IMEI terdaftar Kemenperin, dan konsultasi mudah via WhatsApp.",
};

// Revalidate page data every 60 seconds (ISR)
export const revalidate = 60;

export default async function HomePage() {
  // Fetch dynamic data from database via product.service
  const [featuredProducts, latestProducts, modelsOverview] = await Promise.all([
    getFeaturedProducts(),
    getLatestProducts(8),
    getModelsOverview(),
  ]);

  return (
    <StoreLayout cartCount={0}>
      {/* ─── 1. HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#111111] text-white pt-16 pb-20 sm:pt-28 sm:pb-36 border-b border-white/10">
        {/* Subtle background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-white/5 to-white/0 rounded-full blur-3xl pointer-events-none" />

        <PageContainer>
          <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
            {/* Top Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>Official Warranty & Guaranteed IMEI</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.08]">
              Find Your Next iPhone.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-xl text-[#A1A1A6] font-normal max-w-2xl mx-auto leading-relaxed">
              Discover selected iPhone models with trusted quality and a simple ordering experience.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link href="#featured">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-[#111111] hover:bg-white/90 font-semibold px-8 rounded-full shadow-lg"
                >
                  Shop iPhone
                </Button>
              </Link>
              <Link href="#models">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/25 text-white hover:bg-white/10 px-8 rounded-full"
                >
                  Shop by Model
                </Button>
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="pt-10 grid grid-cols-3 gap-4 border-t border-white/10 text-center max-w-xl mx-auto">
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">100%</p>
                <p className="text-[11px] sm:text-xs text-[#86868B] uppercase tracking-wider mt-0.5">Original Unit</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">Permanen</p>
                <p className="text-[11px] sm:text-xs text-[#86868B] uppercase tracking-wider mt-0.5">IMEI Terdaftar</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">&lt; 5 Menit</p>
                <p className="text-[11px] sm:text-xs text-[#86868B] uppercase tracking-wider mt-0.5">WhatsApp CS</p>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ─── 2. FEATURED iPHONES SECTION ─────────────────────────────────────── */}
      <section id="featured" className="scroll-mt-20">
        <SectionContainer
          title="Featured iPhones"
          subtitle="Koleksi iPhone unggulan dengan jaminan garansi resmi dan performa terbaik."
          badge="Pilihan Utama"
          variant="muted"
          action={
            <Link href="#latest">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm text-[#111111] font-semibold">
                Lihat Semua Produk →
              </Button>
            </Link>
          }
        >
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} featured={true} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Belum Ada Produk Unggulan"
              description="Produk unggulan sedang disiapkan oleh admin. Silakan cek kembali dalam beberapa saat."
            />
          )}
        </SectionContainer>
      </section>

      {/* ─── 3. SHOP BY MODEL SECTION ────────────────────────────────────────── */}
      <section id="models" className="scroll-mt-20">
        <SectionContainer
          title="Shop by Model"
          subtitle="Pilih seri iPhone berdasarkan model spesifik dan kapasitas penyimpanan."
          badge="Kategori Model"
          variant="surface"
        >
          {modelsOverview.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {modelsOverview.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="group flex items-center justify-between p-5 rounded-2xl bg-[#F5F5F7] hover:bg-white hover:shadow-md border border-[#D2D2D7]/40 hover:border-[#111111]/20 transition-all duration-200"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                        {item.categoryName}
                      </span>
                      {item.totalStock > 0 ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" title="Stok Tersedia" />
                      ) : null}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] group-hover:text-[#111111] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#6E6E73]">
                      Mulai <span className="font-semibold text-[#111111]">{formatCurrency(item.minPrice)}</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-2 shrink-0">
                    <Badge variant="secondary" size="sm">
                      {item.variantCount} Varian
                    </Badge>
                    <div className="w-7 h-7 rounded-full bg-white group-hover:bg-[#111111] group-hover:text-white flex items-center justify-center text-[#1D1D1F] transition-colors shadow-2xs">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Model Belum Tersedia"
              description="Daftar model iPhone sedang dimuat dari sistem."
            />
          )}
        </SectionContainer>
      </section>

      {/* ─── 4. LATEST PRODUCTS SECTION ──────────────────────────────────────── */}
      <section id="latest" className="scroll-mt-20">
        <SectionContainer
          title="Latest Products"
          subtitle="Daftar unit iPhone dan aksesoris terbaru yang siap dikirim langsung ke lokasi Anda."
          badge="Katalog Lengkap"
          variant="muted"
        >
          {latestProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Katalog Produk Masih Kosong"
              description="Belum ada produk aktif yang tersedia saat ini."
            />
          )}
        </SectionContainer>
      </section>

      {/* ─── 5. WHY GAMEN STORE SECTION ──────────────────────────────────────── */}
      <SectionContainer variant="surface">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
              Komitmen Kualitas & Pelayanan
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight mt-2">
              Why Gamen Store?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#6E6E73] max-w-2xl mx-auto">
              Kami memastikan setiap transaksi pembelian iPhone Anda berjalan aman, bergaransi resmi, dan transparan dari awal hingga unit tiba di tangan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-[#F5F5F7] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-[#1D1D1F]">IMEI Legal Permanen</h4>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Seluruh unit terdaftar resmi di Kemenperin / Beacukai. Bebas blokir sinyal seumur hidup.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F5F5F7] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-[#1D1D1F]">30+ QC Point Check</h4>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Inspeksi ketat layar, kamera, baterai, True Tone, dan sensor Face ID sebelum dikirim.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F5F5F7] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-[#1D1D1F]">Asuransi & Safety Pack</h4>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Packing kayu tebal dan proteksi asuransi pengiriman penuh ke seluruh pelosok Indonesia.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F5F5F7] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-[#1D1D1F]">WhatsApp Checkout</h4>
              <p className="text-xs text-[#6E6E73] leading-relaxed">
                Tanpa perlu registrasi akun yang rumit. Pesan di web dan konfirmasi instan di WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* ─── 6. PROMOTION & TRADE-IN BANNER SECTION ───────────────────────────── */}
      <section className="py-12 sm:py-20 bg-[#111111] text-white">
        <PageContainer>
          <div className="relative rounded-3xl bg-linear-to-r from-[#1c1c1e] to-[#2c2c2e] border border-white/10 p-8 sm:p-14 overflow-hidden">
            <div className="max-w-2xl space-y-5 relative z-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#16A34A]/20 text-[#16A34A] text-xs font-bold uppercase tracking-wider">
                Special Launch Promotion
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Beli iPhone 16 Series, Gratis Adapter 20W Original & Free Ongkir.
              </h2>
              <p className="text-sm sm:text-base text-[#A1A1A6] leading-relaxed">
                Nikmati penawaran eksklusif bundling aksesoris original Apple dan potongan ongkos kirim ke seluruh kota di Indonesia untuk pemesanan minggu ini.
              </p>
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Admin%20Gamen%20Store,%20saya%20ingin%20klaim%20Promo%20Gratis%20Adapter%2020W%20iPhone%2016"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#16A34A] text-white font-semibold text-sm hover:bg-[#15803D] transition-all shadow-md"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>Klaim Promo via WhatsApp</span>
                </a>
                <Link href="/deals">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl">
                    Detail Syarat & Ketentuan
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </StoreLayout>
  );
}
