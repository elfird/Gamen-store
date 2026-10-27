import Link from "next/link";
import Image from "next/image";
import { StoreLayout, PageContainer, SectionContainer } from "@/components/store";
import { ProductCard } from "@/components/products";
import { EmptyState } from "@/components/ui";
import { getFeaturedProducts, getLatestProducts, getSeriesOverview } from "@/services/product.service";

export const revalidate = 60; // Revalidate every minute for stock updates

export const metadata = {
  title: "Gamen Store — Jual & Beli iPhone Terpercaya via WhatsApp",
  description:
    "Beli iPhone original bergaransi resmi atau jual iPhone lamamu dengan proses cepat, transparan, dan terhubung langsung via WhatsApp resmi Gamen Store.",
};

export default async function HomePage() {
  // Concurrently fetch featured iPhones, latest accessories/products, and series overview
  const [featuredProducts, latestProducts, seriesOverview] = await Promise.all([
    getFeaturedProducts(8),
    getLatestProducts(8),
    getSeriesOverview(),
  ]);

  return (
    <StoreLayout cartCount={0}>
      {/* ─── 1. HERO SECTION (Refined Height & Natural Product Visual) ─────── */}
      <section className="relative overflow-hidden bg-[#F7F7F8] border-b border-[#E5E5E5] pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-14">
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
            {/* Left Column: Editorial Headline & Actions (order-2 on mobile, order-1 on desktop) */}
            <div className="order-2 lg:order-1 lg:col-span-7 space-y-4 sm:space-y-5 text-left">
              {/* Eyebrow label */}
              <div className="inline-flex items-center space-x-2">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#737373] uppercase">
                  APPLE PREMIUM STORE
                </span>
              </div>

              {/* Main Display Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-[46px] lg:text-[50px] font-bold tracking-tight leading-[1.1] text-[#171717]">
                Buy Your Next iPhone. Sell Your Current One.
              </h1>

              {/* Supporting Text */}
              <p className="text-xs sm:text-sm lg:text-base text-[#737373] max-w-lg leading-relaxed font-normal">
                Temukan iPhone pilihanmu atau jual iPhone lamamu. Mulai prosesnya melalui Gamen Store dan lanjutkan transaksi bersama tim kami di WhatsApp.
              </p>

              {/* CTA Buttons (Buy & Sell equally prominent) */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/products?category=iphone"
                  className="inline-flex items-center justify-center space-x-2 h-10 px-6 rounded-full bg-[#171717] text-white hover:bg-black font-semibold text-xs tracking-tight transition-colors shadow-2xs"
                >
                  <span>Beli iPhone</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                <Link
                  href="/sell-iphone"
                  className="inline-flex items-center justify-center space-x-2 h-10 px-6 rounded-full bg-white text-[#171717] border border-[#E5E5E5] hover:bg-[#F7F7F8] font-semibold text-xs tracking-tight transition-colors"
                >
                  <span>Jual iPhone</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17l9.2-9.2M17 17V8H8" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Column: Seamless Product Visual (order-1 on mobile, order-2 on desktop) */}
            <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center items-center">
              <div className="relative w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[400px] flex items-center justify-center">
                <Image
                  src="/images/hero_iphone.jpg"
                  alt="Apple iPhone 16 Pro Flagship Lineup"
                  width={400}
                  height={360}
                  priority
                  className="w-full h-auto max-h-[260px] sm:max-h-[320px] lg:max-h-[360px] object-contain hover:scale-[1.02] transition-transform duration-200"
                />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ─── 2. FEATURED iPHONES SECTION (White Surface) ─────────────────────── */}
      <section id="featured" className="scroll-mt-20">
        <SectionContainer
          title="Featured iPhones"
          subtitle="Koleksi iPhone original dengan garansi resmi dan kualitas terbaik."
          badge="PRODUK PILIHAN"
          variant="surface"
          padding="lg"
          action={
            <Link
              href="/products?category=iphone"
              className="text-xs sm:text-sm font-semibold text-[#171717] hover:underline inline-flex items-center space-x-1"
            >
              <span>Lihat Semua Produk</span>
              <span>→</span>
            </Link>
          }
        >
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
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

      {/* ─── 3. SHOP BY MODEL SECTION (#F7F7F8 Muted Surface) ────────────────── */}
      <section id="models" className="scroll-mt-20">
        <SectionContainer
          title="Shop by Model"
          subtitle="Pilih seri iPhone favoritmu dan temukan varian terbaik sesuai kebutuhanmu."
          badge="KATEGORI PILIHAN"
          variant="muted"
          padding="lg"
          action={
            <Link
              href="/products?category=iphone"
              className="text-xs sm:text-sm font-semibold text-[#171717] hover:underline inline-flex items-center space-x-1"
            >
              <span>Lihat Semua</span>
              <span>→</span>
            </Link>
          }
        >
          {seriesOverview.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {seriesOverview.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="group flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-white border border-[#E5E5E5] hover:border-[#171717]/40 transition-colors"
                >
                  <div className="w-full aspect-square mb-2.5 bg-[#F7F7F8] rounded-lg flex items-center justify-center p-2 overflow-hidden">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={120}
                        height={120}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#737373" strokeWidth="1.5">
                        <rect x="5" y="2" width="14" height="20" rx="2" />
                        <line x1="12" y1="18" x2="12" y2="18.01" />
                      </svg>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-[#171717] group-hover:text-black transition-colors">
                      {item.title}
                    </span>
                    <span className="text-xs text-[#737373] group-hover:text-[#171717] transition-colors">
                      →
                    </span>
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

      {/* ─── 4. LATEST PRODUCTS SECTION (White Surface) ──────────────────────── */}
      <section id="latest" className="scroll-mt-20">
        <SectionContainer
          title="Latest Products"
          subtitle="Jelajahi koleksi terbaru dari iPhone dan aksesori pilihan dengan kualitas terbaik."
          badge="PRODUK TERBARU"
          variant="surface"
          padding="lg"
          action={
            <Link
              href="/products"
              className="text-xs sm:text-sm font-semibold text-[#171717] hover:underline inline-flex items-center space-x-1"
            >
              <span>Lihat Semua</span>
              <span>→</span>
            </Link>
          }
        >
          {latestProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
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

      {/* ─── 5. WHY GAMEN STORE SECTION (#F7F7F8 Muted Surface) ──────────────── */}
      <section className="bg-[#F7F7F8] border-t border-[#E5E5E5] py-10 sm:py-14">
        <PageContainer>
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-[#737373]">
                MENGAPA BELI DI GAMEN STORE?
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#171717] tracking-tight mt-1">
                Why Gamen Store?
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-[#737373] max-w-xl mx-auto leading-relaxed">
                Kami berkomitmen untuk memberikan pengalaman belanja terbaik dengan produk asli, harga kompetitif, dan layanan yang dapat diandalkan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-center">
              {/* Feature 1 */}
              <div className="flex flex-col items-center space-y-2.5 p-3">
                <div className="w-9 h-9 rounded-full border border-[#E5E5E5] bg-white text-[#171717] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#171717]">100% Produk Original</h3>
                <p className="text-[11px] sm:text-xs text-[#737373] leading-relaxed">
                  Semua produk bergaransi resmi
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center space-y-2.5 p-3">
                <div className="w-9 h-9 rounded-full border border-[#E5E5E5] bg-white text-[#171717] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#171717]">Pengiriman Cepat</h3>
                <p className="text-[11px] sm:text-xs text-[#737373] leading-relaxed">
                  Pesanan dikirim dalam 1-2 hari kerja
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center space-y-2.5 p-3">
                <div className="w-9 h-9 rounded-full border border-[#E5E5E5] bg-white text-[#171717] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#171717]">Garansi Resmi</h3>
                <p className="text-[11px] sm:text-xs text-[#737373] leading-relaxed">
                  Klaim garansi lebih mudah
                </p>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center space-y-2.5 p-3">
                <div className="w-9 h-9 rounded-full border border-[#E5E5E5] bg-white text-[#171717] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#171717]">Customer Support</h3>
                <p className="text-[11px] sm:text-xs text-[#737373] leading-relaxed">
                  Siap membantu 24/7
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </StoreLayout>
  );
}
