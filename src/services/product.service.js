import prisma from "@/lib/prisma";

/**
 * Product Service — Server-side data fetching & business logic for Products.
 *
 * Encapsulates database queries using Prisma Client.
 * All functions return plain JSON-serializable objects.
 */

/**
 * Serialize decimal fields and relations into safe plain JavaScript objects.
 * @param {Object} product
 * @returns {Object}
 */
export function formatProductData(product) {
  if (!product) return null;

  const variants = (product.variants || []).map((v) => ({
    id: v.id,
    sku: v.sku,
    storage: v.storage,
    color: v.color,
    price: Number(v.price),
    purchasePrice: Number(v.purchasePrice),
    stock: v.stock,
    reservedStock: v.reservedStock,
    availableStock: Math.max(0, v.stock - (v.reservedStock || 0)),
    active: v.active,
  }));

  // Calculate starting price and total available stock across variants
  const activeVariants = variants.filter((v) => v.active);
  const minPrice = activeVariants.length > 0
    ? Math.min(...activeVariants.map((v) => v.price))
    : 0;
  const maxPrice = activeVariants.length > 0
    ? Math.max(...activeVariants.map((v) => v.price))
    : 0;
  const totalStock = activeVariants.reduce((sum, v) => sum + v.availableStock, 0);

  // Extract unique storage and colors
  const availableStorages = [...new Set(activeVariants.map((v) => v.storage))];
  const availableColors = [...new Set(activeVariants.map((v) => v.color))];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    model: product.model,
    description: product.description,
    warranty: product.warranty,
    condition: product.condition,
    active: product.active,
    featured: product.featured,
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString(),
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        }
      : null,
    images: (product.images || []).map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    })),
    primaryImage:
      product.images?.find((img) => img.isPrimary)?.url ||
      product.images?.[0]?.url ||
      null,
    variants,
    minPrice,
    maxPrice,
    totalStock,
    availableStorages,
    availableColors,
    isInStock: totalStock > 0,
  };
}

/**
 * Fetch featured products for homepage.
 * @returns {Promise<Array>}
 */
export async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        featured: true,
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: {
          where: { active: true },
          orderBy: { price: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return products.map(formatProductData);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

/**
 * Fetch latest products for homepage or storefront.
 * @param {number} [limit=8]
 * @returns {Promise<Array>}
 */
export async function getLatestProducts(limit = 8) {
  try {
    const products = await prisma.product.findMany({
      where: {
        active: true,
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: {
          where: { active: true },
          orderBy: { price: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return products.map(formatProductData);
  } catch (error) {
    console.error("Error fetching latest products:", error);
    return [];
  }
}

/**
 * Fetch dynamic summary of models / categories for "Shop by Model".
 * @returns {Promise<Array>}
 */
export async function getModelsOverview() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: {
        category: true,
        variants: {
          where: { active: true },
        },
      },
      orderBy: { name: "asc" },
    });

    // Group or summarize models
    return products.map((p) => {
      const activeVariants = p.variants || [];
      const minPrice = activeVariants.length > 0
        ? Math.min(...activeVariants.map((v) => Number(v.price)))
        : 0;
      const totalStock = activeVariants.reduce(
        (sum, v) => sum + Math.max(0, v.stock - (v.reservedStock || 0)),
        0
      );

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        model: p.model,
        categoryName: p.category?.name || "iPhone",
        categorySlug: p.category?.slug || "iphone",
        variantCount: activeVariants.length,
        minPrice,
        totalStock,
      };
    });
  } catch (error) {
    console.error("Error fetching models overview:", error);
    return [];
  }
}
