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

/**
 * Fetch a single product by its unique slug with full details,
 * active variants, images, and public inventory metrics (e.g. battery health range).
 *
 * SENSITIVE DATA PROTECTION:
 * Internal IMEI numbers and serial numbers are NEVER returned to the public frontend.
 *
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function getProductBySlug(slug) {
  if (!slug) return null;

  try {
    const product = await prisma.product.findUnique({
      where: {
        slug,
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
          include: {
            // Include inventory units solely for public condition metrics (battery health range)
            inventoryUnits: {
              where: { status: "AVAILABLE" },
              select: {
                batteryHealth: true,
                condition: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!product) return null;

    const baseData = formatProductData(product);

    // Compute public aggregate battery health range across available units
    const allUnits = product.variants.flatMap((v) => v.inventoryUnits || []);
    const batteryHealths = allUnits
      .map((u) => u.batteryHealth)
      .filter((b) => b !== null && b !== undefined);

    const minBattery = batteryHealths.length > 0 ? Math.min(...batteryHealths) : null;
    const maxBattery = batteryHealths.length > 0 ? Math.max(...batteryHealths) : null;

    const batteryHealthDisplay =
      minBattery && maxBattery
        ? minBattery === maxBattery
          ? `${minBattery}%`
          : `${minBattery}% – ${maxBattery}%`
        : "100% (Battery Health Prima)";

    // Standard Apple device specifications lookup
    const specifications = getProductSpecifications(product.name, product.model);

    return {
      ...baseData,
      batteryHealthDisplay,
      specifications,
    };
  } catch (error) {
    console.error(`Error fetching product by slug (${slug}):`, error);
    return null;
  }
}

/**
 * Fetch related products in the same category.
 * @param {string} categoryId
 * @param {string} currentProductId
 * @param {number} [limit=4]
 * @returns {Promise<Array>}
 */
export async function getRelatedProducts(categoryId, currentProductId, limit = 4) {
  try {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        id: { not: currentProductId },
        ...(categoryId ? { categoryId } : {}),
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
      orderBy: { featured: "desc" },
      take: limit,
    });

    return products.map(formatProductData);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

/**
 * Helper to generate comprehensive tech specs for iPhone models and accessories.
 * @param {string} name
 * @param {string} model
 * @returns {Array<{ group: string, items: Array<{ label: string, value: string }> }>}
 */
function getProductSpecifications(name = "", _model = "") {
  const is16ProMax = name.includes("16 Pro Max");
  const is16Pro = name.includes("16 Pro") && !is16ProMax;
  const is16 = name.includes("16") && !name.includes("Pro");
  const is15ProMax = name.includes("15 Pro Max");
  const is15Pro = name.includes("15 Pro") && !is15ProMax;
  const isAccessory = name.includes("Adapter") || name.includes("Charger");

  if (isAccessory) {
    return [
      {
        group: "Spesifikasi Daya & Kompatibilitas",
        items: [
          { label: "Daya Output", value: "20 Watt Fast Charging USB-PD" },
          { label: "Port", value: "USB-C Port Reversible" },
          { label: "Kompatibilitas", value: "iPhone 8 hingga iPhone 16 Series, iPad, Apple Watch" },
          { label: "Garansi", value: "1 Tahun Garansi Resmi Apple" },
        ],
      },
    ];
  }

  return [
    {
      group: "Performa & Chipset",
      items: [
        {
          label: "Chipset",
          value: is16ProMax || is16Pro
            ? "Apple A18 Pro (3nm) dengan 6-core GPU & 16-core Neural Engine"
            : is16
            ? "Apple A18 (3nm) dengan 5-core GPU & 16-core Neural Engine"
            : is15ProMax || is15Pro
            ? "Apple A17 Pro (3nm) dengan Ray Tracing berbasis hardware"
            : "Apple A16 Bionic (4nm)",
        },
        {
          label: "Sistem Operasi",
          value: "iOS 18 (Dukungan update jangka panjang hingga 5+ tahun)",
        },
      ],
    },
    {
      group: "Layar & Tampilan",
      items: [
        {
          label: "Tipe Layar",
          value: is16ProMax
            ? "6.9 inci Super Retina XDR OLED, ProMotion 120Hz, Always-On display"
            : is16Pro
            ? "6.3 inci Super Retina XDR OLED, ProMotion 120Hz, Always-On display"
            : is16
            ? "6.1 inci Super Retina XDR OLED, Dynamic Island, Kecerahan hingga 2000 nits"
            : is15ProMax
            ? "6.7 inci Super Retina XDR OLED, ProMotion 120Hz, Always-On display"
            : is15Pro
            ? "6.1 inci Super Retina XDR OLED, ProMotion 120Hz, Always-On display"
            : "6.1 inci Super Retina XDR OLED, Dynamic Island, Kecerahan 2000 nits",
        },
        {
          label: "Proteksi Layar",
          value: "Ceramic Shield generasi terbaru (2x lebih tangguh dari kaca smartphone mana pun)",
        },
      ],
    },
    {
      group: "Sistem Kamera",
      items: [
        {
          label: "Kamera Utama",
          value: is16ProMax || is16Pro
            ? "Sistem Pro 48MP Fusion + 48MP Ultra Wide + 12MP Telephoto 5x Optical Zoom"
            : is15ProMax
            ? "Sistem Pro 48MP Utama + 12MP Ultra Wide + 12MP Telephoto 5x Optical Zoom"
            : "Sistem Kamera Ganda 48MP Utama + 12MP Ultra Wide",
        },
        {
          label: "Fitur Video",
          value: is16ProMax || is16Pro
            ? "Perekaman video Dolby Vision 4K pada 120 fps, Audio Spasial & Studio Mics"
            : "Perekaman video 4K pada 60 fps, Mode Sinematik 4K HDR, Action Mode",
        },
      ],
    },
    {
      group: "Bodi & Material",
      items: [
        {
          label: "Material Rangka",
          value: is16ProMax || is16Pro || is15ProMax || is15Pro
            ? "Titanium Grade 5 Luar Angkasa dengan tekstur micro-blasted elegan"
            : "Aluminium kualitas kedirgantaraan dengan kaca belakang berinfusi warna",
        },
        {
          label: "Ketahanan Air & Debu",
          value: "Level IP68 (Kedalaman maksimum 6 meter hingga 30 menit)",
        },
        {
          label: "Port & Konektivitas",
          value: is16ProMax || is16Pro || is15ProMax || is15Pro
            ? "USB-C dengan kecepatan USB 3 (hingga 10 Gb/s), 5G, Wi-Fi 7 / 6E"
            : "USB-C (USB 2), 5G, Wi-Fi 6",
        },
      ],
    },
  ];
}

