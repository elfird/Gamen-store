import { Suspense } from "react";
import Link from "next/link";
import { StoreLayout, PageContainer } from "@/components/store";
import { ProductCard, ProductFilters } from "@/components/products";
import { EmptyState, Button } from "@/components/ui";
import { getProducts } from "@/services/product.service";

export const dynamic = "force-dynamic";

/**
 * Dynamic SEO metadata for Products Catalog
 */
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const search = params?.search;
  const category = params?.category;

  let title = "Katalog iPhone & Aksesoris Original";
  if (category === "iphone") title = "Katalog iPhone Original & Garansi Resmi";
  if (category === "accessories") title = "Aksesoris Original Apple & Charger";
  if (category === "deals") title = "Promo & Penawaran Spesial iPhone";
  if (search) title = `Cari "${search}" — Katalog Produk`;

  return {
    title: `${title} | Gamen Store`,
    description:
      "Temukan seri iPhone pilihan terbaru dan aksesoris original bergaransi resmi. IMEI terdaftar permanen Kemenperin dengan pilihan cicilan & konsultasi WhatsApp.",
  };
}

export default async function ProductsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || "";
  const category = resolvedParams?.category || "";
  const series = resolvedParams?.series || "";
  const storage = resolvedParams?.storage || "";
  const condition = resolvedParams?.condition || "";
  const sort = resolvedParams?.sort || "default";

  // Fetch filtered products server-side
  const products = await getProducts({
    search,
    category,
    series,
    storage,
    condition,
    sort,
  });

  // Dynamic Heading & Description
  let pageTitle = "Katalog iPhone & Aksesoris";
  let pageSubtitle =
    "Jelajahi lini iPhone resmi dan aksesoris original bergaransi. Semua unit melalui 30+ tahapan inspeksi kualitas ketat.";

  if (category === "iphone") {
    pageTitle = "Semua Seri iPhone";
    pageSubtitle =
      "Pilihan iPhone 16 Series hingga iPhone 13 dengan sinyal aman permanen & garansi resmi.";
  } else if (category === "accessories") {
    pageTitle = "Aksesoris Original Apple";
    pageSubtitle =
      "Power adapter 20W USB-C, kabel data type-C to type-C, dan aksesoris proteksi original.";
  } else if (category === "deals") {
    pageTitle = "Penawaran Khusus & Promo";
    pageSubtitle =
      "Unit pilihan dengan penawaran harga terbaik dan bundling aksesoris original minggu ini.";
  } else if (search) {
    pageTitle = `Hasil Pencarian: "${search}"`;
    pageSubtitle = `Ditemukan ${products.length} produk yang sesuai dengan kata kunci "${search}".`;
  }

  return (
    <StoreLayout>
      <div className="py-8 sm:py-12 bg-white min-h-[85vh]">
        <PageContainer>
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-xs font-medium text-[#737373] mb-6">
            <Link href="/" className="hover:text-[#171717] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#171717] font-semibold">Katalog Produk</span>
            {category && category !== "all" && (
              <>
                <span>/</span>
                <span className="capitalize text-[#171717]">
                  {category === "iphone"
                    ? "iPhone"
                    : category === "accessories"
                    ? "Aksesoris"
                    : category}
                </span>
              </>
            )}
          </nav>

          {/* Catalog Page Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E5E5]">
            <div>
              <div className="text-[11px] font-bold tracking-widest text-[#737373] uppercase mb-1.5">
                KATALOG RESMI GAMEN STORE
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
                {pageTitle}
              </h1>
              <p className="text-xs sm:text-sm text-[#737373] mt-1.5 max-w-2xl leading-relaxed">
                {pageSubtitle}
              </p>
            </div>

            <div className="text-xs text-[#737373] font-medium shrink-0 bg-[#F7F7F8] px-3.5 py-2 rounded-xl border border-[#E5E5E5] self-start md:self-auto">
              Total: <strong className="text-[#171717] font-bold">{products.length}</strong> produk tersedia
            </div>
          </div>

          {/* Filter Bar + Catalog Grid */}
          <Suspense
            fallback={
              <div className="space-y-6">
                <div className="h-28 bg-[#F7F7F8] rounded-2xl border border-[#E5E5E5] animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-80 bg-[#F7F7F8] rounded-2xl border border-[#E5E5E5] animate-pulse" />
                  ))}
                </div>
              </div>
            }
          >
            <ProductFilters
              initialParams={{
                search,
                category,
                series,
                storage,
                condition,
                sort,
              }}
            >
              {/* Main Product Grid */}
              <div className="flex-1 w-full">
                {products.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 sm:p-14 text-center shadow-xs">
                    <EmptyState
                      title="Tidak Ada Produk yang Ditemukan"
                      description="Maaf, tidak ada produk yang cocok dengan filter atau kata kunci pencarian Anda. Coba sesuaikan filter atau reset untuk melihat semua koleksi."
                      icon={
                        <div className="w-14 h-14 rounded-2xl bg-[#F7F7F8] text-[#171717] flex items-center justify-center mx-auto mb-2">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                          </svg>
                        </div>
                      }
                      action={
                        <Link href="/products">
                          <Button
                            variant="primary"
                            className="rounded-xl px-6 py-2.5 text-xs font-semibold mt-4"
                          >
                            Reset Semua Filter
                          </Button>
                        </Link>
                      }
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </ProductFilters>
          </Suspense>
        </PageContainer>
      </div>
    </StoreLayout>
  );
}
