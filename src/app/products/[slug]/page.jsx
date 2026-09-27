import { notFound } from "next/navigation";
import Link from "next/link";
import {
  StoreLayout,
  PageContainer,
  SectionContainer,
} from "@/components/store";
import {
  ProductGallery,
  ProductInfo,
  ProductSpecs,
  ProductCard,
} from "@/components/products";
import { Breadcrumb } from "@/components/ui";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/services/product.service";
import { formatCurrency } from "@/lib/utils";

// Revalidate product page every 60s
export const revalidate = 60;

/**
 * Dynamic SEO metadata generation
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan | Gamen Store",
      description: "Produk yang Anda cari tidak tersedia di katalog Gamen Store.",
    };
  }

  const priceText = formatCurrency(product.minPrice);
  return {
    title: `${product.name} — Garansi Resmi & IMEI Terdaftar | Gamen Store`,
    description: `Beli ${product.name} ${product.condition === "NEW" ? "Baru Segel" : "Like New"} ${priceText}. Garansi resmi, IMEI terdaftar Kemenperin, pengiriman cepat & aman.`,
    openGraph: {
      title: `${product.name} — Gamen Store`,
      description: `Beli ${product.name} mulai dari ${priceText}. IMEI terdaftar permanen & 100% original.`,
      images: product.primaryImage ? [{ url: product.primaryImage }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.category?.id,
    product.id,
    4
  );

  const breadcrumbItems = [
    { label: "Beranda", href: "/" },
    {
      label: product.category?.name || "Katalog iPhone",
      href: product.category?.slug ? `/category/${product.category.slug}` : "/products",
    },
    { label: product.name, current: true },
  ];

  return (
    <StoreLayout cartCount={0}>
      <div className="py-6 sm:py-10">
        <PageContainer>
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* ─── Main Product Detail Grid (Left: Gallery, Right: Info) ─────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Column: Product Gallery */}
            <div className="lg:col-span-6 lg:sticky lg:top-24">
              <ProductGallery
                images={product.images}
                productName={product.name}
                condition={product.condition}
              />
            </div>

            {/* Right Column: Interactive Product Information */}
            <div className="lg:col-span-6">
              <ProductInfo product={product} />
            </div>
          </div>

          {/* ─── Specifications Section ───────────────────────────────────────── */}
          <div className="mt-16 sm:mt-24 pt-12 border-t border-[#D2D2D7]/60">
            <div className="max-w-4xl">
              <ProductSpecs specifications={product.specifications} />
            </div>
          </div>
        </PageContainer>

        {/* ─── Related Products Section ───────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24">
            <SectionContainer
              title="Rekomendasi Lainnya"
              subtitle="Pilihan seri iPhone dan perangkat pendukung lainnya yang mungkin Anda sukai."
              badge="Produk Terkait"
              variant="muted"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} />
                ))}
              </div>
            </SectionContainer>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
