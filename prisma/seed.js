/**
 * Prisma Seed Script — Gamen Store
 *
 * Populates complete, realistic Indonesian market data for Gamen Store:
 * 1. Admin & Staff Users (Bcrypt hashed)
 * 2. Store Settings (Prisma StoreSetting model)
 * 3. Categories (iPhone & Accessories)
 * 4. 17 iPhone Products (BNIB New Segel & Second Like New Ex-iBox) & Apple Accessories
 * 5. Full Product Variants with realistic storage, colors, SKUs, prices, compareAtPrice (harga coret), and HPP (purchasePrice)
 * 6. High-definition product images
 * 7. Certified Suppliers (iBox / GDN distributors)
 * 8. Indonesian Customers
 * 9. Physical Inventory Units with unique IMEIs, serial numbers, battery health, and conditions
 * 10. Purchases (PO) & Customer Orders
 * 11. Financial Transactions & Categories (Capital, Revenue, COGS, Expenses)
 *
 * 100% Idempotent: safe to run multiple times without duplicate errors.
 * Run with: npm run db:seed or node prisma/seed.js
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Gamen Store database seeding...\n");

  // ─── 1. Admin & Staff Accounts ────────────────────────────────────────────────
  console.log("👤 1. Seeding Admin & Staff accounts...");
  const adminPassword = await bcrypt.hash("admin123456", 10);
  const staffPassword = await bcrypt.hash("staff123456", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@gamenstore.com" },
    update: {
      name: "Administrator Gamen",
      role: "ADMIN",
      active: true,
    },
    create: {
      name: "Administrator Gamen",
      email: "admin@gamenstore.com",
      password: adminPassword,
      role: "ADMIN",
      active: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@gamenstore.com" },
    update: {
      name: "Staff Store Gamen",
      role: "STAFF",
      active: true,
    },
    create: {
      name: "Staff Store Gamen",
      email: "staff@gamenstore.com",
      password: staffPassword,
      role: "STAFF",
      active: true,
    },
  });
  console.log("   ✓ Admin (admin@gamenstore.com) & Staff seeded.");

  // ─── 2. Store Settings ────────────────────────────────────────────────────────
  console.log("⚙️  2. Seeding Store Settings...");
  await prisma.storeSetting.upsert({
    where: { key: "default" },
    update: {
      storeName: "Gamen Store",
      storeDescription: "Toko iPhone terpercaya dengan garansi resmi dan pilihan terlengkap di Indonesia.",
      whatsappNumber: "6282297046402",
      email: "support@gamenstore.com",
      address: "Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan",
      defaultShippingCost: 0,
      currency: "IDR",
      orderPrefix: "ORD",
      messageTemplate:
        "Halo Admin Gamen Store, saya ingin memesan unit iPhone:\n\nOrder ID: {orderNumber}\nTotal: {total}\n\nMohon info ketersediaan stok & proses pengirimannya. Terima kasih!",
    },
    create: {
      key: "default",
      storeName: "Gamen Store",
      storeDescription: "Toko iPhone terpercaya dengan garansi resmi dan pilihan terlengkap di Indonesia.",
      whatsappNumber: "6282297046402",
      email: "support@gamenstore.com",
      address: "Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan",
      defaultShippingCost: 0,
      currency: "IDR",
      orderPrefix: "ORD",
      messageTemplate:
        "Halo Admin Gamen Store, saya ingin memesan unit iPhone:\n\nOrder ID: {orderNumber}\nTotal: {total}\n\nMohon info ketersediaan stok & proses pengirimannya. Terima kasih!",
    },
  });
  console.log("   ✓ Store Settings saved to database.");

  // ─── 3. Categories ────────────────────────────────────────────────────────────
  console.log("📦 3. Seeding Categories...");
  const categoriesData = [
    {
      name: "iPhone",
      slug: "iphone",
      description: "Smartphone flagship Apple iPhone original, BNIB segel resmi Indonesia & Second Like New Grade A+.",
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Aksesoris original Apple resmi: charger 20W, MagSafe, AirPods Pro, dan casing pelindung.",
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
  }
  console.log(`   ✓ ${Object.keys(categories).length} Categories upserted.`);

  // ─── 3.5. Safe Cleanup & Archival of Old Dummy Records ────────────────────────
  console.log("🧹 3.5. Cleaning up obsolete test variants & products...");
  const obsoleteVariants = await prisma.productVariant.findMany({
    where: {
      OR: [
        { sku: { startsWith: "IPH" } },
        { sku: { startsWith: "ACC-PWR" } },
      ],
    },
    include: {
      orderItems: true,
      inventoryUnits: true,
      purchaseItems: true,
    },
  });

  for (const v of obsoleteVariants) {
    if (v.orderItems.length === 0 && v.inventoryUnits.length === 0 && v.purchaseItems.length === 0) {
      await prisma.productVariant.delete({ where: { id: v.id } });
    } else {
      await prisma.productVariant.update({
        where: { id: v.id },
        data: { active: false },
      });
    }
  }

  // Archive any old duplicate product slugs not in our official 17 products list
  const activeProductSlugs = [
    "iphone-16-pro-max",
    "iphone-16-pro",
    "iphone-16",
    "iphone-15",
    "iphone-13",
    "iphone-15-pro-max-second",
    "iphone-15-pro-second",
    "iphone-14-pro-max-second",
    "iphone-14-pro-second",
    "iphone-13-pro-max-second",
    "iphone-13-second",
    "iphone-12-second",
    "iphone-11-second",
    "apple-20w-usbc-power-adapter",
    "airpods-pro-2nd-gen-usbc",
    "apple-magsafe-charger-original",
    "clear-case-magsafe-iphone-15-16",
  ];

  await prisma.product.updateMany({
    where: {
      slug: { notIn: activeProductSlugs },
    },
    data: {
      active: false,
    },
  });
  console.log("   ✓ Obsolete dummy variants and products archived safely.");

  // ─── 4. Products & Variants (Indonesian Market Specification) ─────────────────
  console.log("📱 4. Seeding 17 Products & Realistic Variants...");

  const productsData = [
    // ══════════════════════════════════════════════════════════════════════════
    // A. KATEGORI: iPHONE BARU (BNIB GARANSI RESMI INDONESIA)
    // ══════════════════════════════════════════════════════════════════════════
    {
      name: "iPhone 16 Pro Max",
      slug: "iphone-16-pro-max",
      model: "A3296 (PA/A)",
      categorySlug: "iphone",
      condition: "NEW",
      featured: true,
      warranty: "1 Tahun Garansi Resmi Indonesia (iBox / Digimap / GDN)",
      description:
        "Brand New In Box (BNIB) Segel Resmi Green Peel. iPhone 16 Pro Max hadir dengan bodi Titanium Grade 5 ultra ringan, layar Super Retina XDR 6.9 inci dengan ProMotion 120Hz, chip A18 Pro bertenaga tinggi, tombol Camera Control inovatif, dan sistem kamera telephoto 5x zoom optik tercanggih. 100% IMEI terdaftar resmi di Kemenperin & Bea Cukai, bebas blokir sinyal seumur hidup.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
          alt: "iPhone 16 Pro Max Desert Titanium",
          isPrimary: true,
          sortOrder: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1695048065052-16e792c3a516?w=800&auto=format&fit=crop&q=80",
          alt: "iPhone 16 Pro Max Natural Titanium",
          isPrimary: false,
          sortOrder: 2,
        },
      ],
      variants: [
        // 256GB - Jual: 21.999.000, Coret: 22.999.000, Modal: 19.799.000
        { sku: "IP16PM-256-DST-NEW", storage: "256GB", color: "Desert Titanium", price: 21999000, compareAtPrice: 22999000, purchasePrice: 19799000, stock: 8 },
        { sku: "IP16PM-256-NAT-NEW", storage: "256GB", color: "Natural Titanium", price: 21999000, compareAtPrice: 22999000, purchasePrice: 19799000, stock: 10 },
        { sku: "IP16PM-256-WHT-NEW", storage: "256GB", color: "White Titanium", price: 21999000, compareAtPrice: 22999000, purchasePrice: 19799000, stock: 6 },
        { sku: "IP16PM-256-BLK-NEW", storage: "256GB", color: "Black Titanium", price: 21999000, compareAtPrice: 22999000, purchasePrice: 19799000, stock: 7 },
        // 512GB - Jual: 25.999.000, Coret: 27.499.000, Modal: 23.399.000
        { sku: "IP16PM-512-DST-NEW", storage: "512GB", color: "Desert Titanium", price: 25999000, compareAtPrice: 27499000, purchasePrice: 23399000, stock: 5 },
        { sku: "IP16PM-512-NAT-NEW", storage: "512GB", color: "Natural Titanium", price: 25999000, compareAtPrice: 27499000, purchasePrice: 23399000, stock: 5 },
        { sku: "IP16PM-512-BLK-NEW", storage: "512GB", color: "Black Titanium", price: 25999000, compareAtPrice: 27499000, purchasePrice: 23399000, stock: 4 },
        // 1TB - Jual: 29.999.000, Coret: 31.499.000, Modal: 26.999.000
        { sku: "IP16PM-1TB-NAT-NEW", storage: "1TB", color: "Natural Titanium", price: 29999000, compareAtPrice: 31499000, purchasePrice: 26999000, stock: 3 },
        { sku: "IP16PM-1TB-BLK-NEW", storage: "1TB", color: "Black Titanium", price: 29999000, compareAtPrice: 31499000, purchasePrice: 26999000, stock: 3 },
      ],
    },

    {
      name: "iPhone 16 Pro",
      slug: "iphone-16-pro",
      model: "A3293 (PA/A)",
      categorySlug: "iphone",
      condition: "NEW",
      featured: true,
      warranty: "1 Tahun Garansi Resmi Indonesia (iBox / Digimap / GDN)",
      description:
        "Brand New In Box (BNIB) Segel Resmi. iPhone 16 Pro menghadirkan performa pro dalam ukuran 6.3 inci yang sempurna digenggam. Didukung chip A18 Pro 3nm, bodi Titanium Grade 5, Camera Control presisi tinggi, dan daya tahan baterai superior. Garansi resmi 1 tahun berlaku di seluruh Apple Authorized Service Provider di Indonesia.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
          alt: "iPhone 16 Pro Natural Titanium",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        // 128GB - Jual: 17.999.000, Coret: 18.999.000, Modal: 16.199.000
        { sku: "IP16P-128-DST-NEW", storage: "128GB", color: "Desert Titanium", price: 17999000, compareAtPrice: 18999000, purchasePrice: 16199000, stock: 6 },
        { sku: "IP16P-128-NAT-NEW", storage: "128GB", color: "Natural Titanium", price: 17999000, compareAtPrice: 18999000, purchasePrice: 16199000, stock: 7 },
        { sku: "IP16P-128-BLK-NEW", storage: "128GB", color: "Black Titanium", price: 17999000, compareAtPrice: 18999000, purchasePrice: 16199000, stock: 5 },
        // 256GB - Jual: 20.499.000, Coret: 21.499.000, Modal: 18.449.000
        { sku: "IP16P-256-DST-NEW", storage: "256GB", color: "Desert Titanium", price: 20499000, compareAtPrice: 21499000, purchasePrice: 18449000, stock: 8 },
        { sku: "IP16P-256-NAT-NEW", storage: "256GB", color: "Natural Titanium", price: 20499000, compareAtPrice: 21499000, purchasePrice: 18449000, stock: 9 },
        { sku: "IP16P-256-WHT-NEW", storage: "256GB", color: "White Titanium", price: 20499000, compareAtPrice: 21499000, purchasePrice: 18449000, stock: 6 },
        { sku: "IP16P-256-BLK-NEW", storage: "256GB", color: "Black Titanium", price: 20499000, compareAtPrice: 21499000, purchasePrice: 18449000, stock: 6 },
        // 512GB - Jual: 24.499.000, Coret: 25.999.000, Modal: 22.049.000
        { sku: "IP16P-512-NAT-NEW", storage: "512GB", color: "Natural Titanium", price: 24499000, compareAtPrice: 25999000, purchasePrice: 22049000, stock: 4 },
        { sku: "IP16P-512-BLK-NEW", storage: "512GB", color: "Black Titanium", price: 24499000, compareAtPrice: 25999000, purchasePrice: 22049000, stock: 3 },
      ],
    },

    {
      name: "iPhone 16",
      slug: "iphone-16",
      model: "A3287 (PA/A)",
      categorySlug: "iphone",
      condition: "NEW",
      featured: true,
      warranty: "1 Tahun Garansi Resmi Indonesia (iBox / Digimap / GDN)",
      description:
        "Brand New In Box (BNIB) Segel Resmi. iPhone 16 hadir dengan lompatan besar: Camera Control pintar, Action Button multifungsi, kamera Fusion 48MP dengan 2x Telephoto optik, dan chip A18 berarsitektur canggih. Pilihan warna segar dan cerah berinfusi kaca belakang yang tangguh.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
          alt: "iPhone 16 Ultramarine & Colors",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        // 128GB - Jual: 14.499.000, Coret: 15.499.000, Modal: 13.049.000
        { sku: "IP16-128-BLU-NEW", storage: "128GB", color: "Ultramarine", price: 14499000, compareAtPrice: 15499000, purchasePrice: 13049000, stock: 9 },
        { sku: "IP16-128-TEA-NEW", storage: "128GB", color: "Teal", price: 14499000, compareAtPrice: 15499000, purchasePrice: 13049000, stock: 7 },
        { sku: "IP16-128-PNK-NEW", storage: "128GB", color: "Pink", price: 14499000, compareAtPrice: 15499000, purchasePrice: 13049000, stock: 8 },
        { sku: "IP16-128-WHT-NEW", storage: "128GB", color: "White", price: 14499000, compareAtPrice: 15499000, purchasePrice: 13049000, stock: 8 },
        { sku: "IP16-128-BLK-NEW", storage: "128GB", color: "Black", price: 14499000, compareAtPrice: 15499000, purchasePrice: 13049000, stock: 10 },
        // 256GB - Jual: 16.999.000, Coret: 17.999.000, Modal: 15.299.000
        { sku: "IP16-256-BLU-NEW", storage: "256GB", color: "Ultramarine", price: 16999000, compareAtPrice: 17999000, purchasePrice: 15299000, stock: 6 },
        { sku: "IP16-256-BLK-NEW", storage: "256GB", color: "Black", price: 16999000, compareAtPrice: 17999000, purchasePrice: 15299000, stock: 7 },
        { sku: "IP16-256-WHT-NEW", storage: "256GB", color: "White", price: 16999000, compareAtPrice: 17999000, purchasePrice: 15299000, stock: 5 },
      ],
    },

    {
      name: "iPhone 15",
      slug: "iphone-15",
      model: "A3090 (PA/A)",
      categorySlug: "iphone",
      condition: "NEW",
      featured: true,
      warranty: "1 Tahun Garansi Resmi Indonesia (iBox / Digimap / GDN)",
      description:
        "Brand New In Box (BNIB) Segel Resmi — Best Seller! iPhone 15 dilengkapi fitur Dynamic Island, kamera utama 48MP dengan detail jernih menawan, port USB-C universal, dan chip A16 Bionic yang terbukti kencang dan hemat daya. Pilihan terbaik untuk flagship modern harga terjangkau.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1695048065052-16e792c3a516?w=800&auto=format&fit=crop&q=80",
          alt: "iPhone 15 Blue & Pink",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        // 128GB - Jual: 12.249.000, Coret: 13.499.000, Modal: 11.024.000
        { sku: "IP15-128-PNK-NEW", storage: "128GB", color: "Pink", price: 12249000, compareAtPrice: 13499000, purchasePrice: 11024000, stock: 12 },
        { sku: "IP15-128-BLU-NEW", storage: "128GB", color: "Blue", price: 12249000, compareAtPrice: 13499000, purchasePrice: 11024000, stock: 10 },
        { sku: "IP15-128-GRN-NEW", storage: "128GB", color: "Green", price: 12249000, compareAtPrice: 13499000, purchasePrice: 11024000, stock: 7 },
        { sku: "IP15-128-YLW-NEW", storage: "128GB", color: "Yellow", price: 12249000, compareAtPrice: 13499000, purchasePrice: 11024000, stock: 6 },
        { sku: "IP15-128-BLK-NEW", storage: "128GB", color: "Black", price: 12249000, compareAtPrice: 13499000, purchasePrice: 11024000, stock: 14 },
        // 256GB - Jual: 14.749.000, Coret: 15.999.000, Modal: 13.274.000
        { sku: "IP15-256-BLK-NEW", storage: "256GB", color: "Black", price: 14749000, compareAtPrice: 15999000, purchasePrice: 13274000, stock: 8 },
        { sku: "IP15-256-BLU-NEW", storage: "256GB", color: "Blue", price: 14749000, compareAtPrice: 15999000, purchasePrice: 13274000, stock: 6 },
        { sku: "IP15-256-PNK-NEW", storage: "256GB", color: "Pink", price: 14749000, compareAtPrice: 15999000, purchasePrice: 13274000, stock: 7 },
      ],
    },

    {
      name: "iPhone 13",
      slug: "iphone-13",
      model: "A2633 (ID/A)",
      categorySlug: "iphone",
      condition: "NEW",
      featured: false,
      warranty: "1 Tahun Garansi Resmi Indonesia (iBox / Digimap / GDN)",
      description:
        "Brand New In Box (BNIB) Segel Resmi — Entry Favorit Apple Fans! iPhone 13 menawarkan layar Super Retina XDR OLED cerah, daya tahan baterai seharian penuh, chip A15 Bionic responsif, dan sistem kamera ganda dengan Cinematic Mode. Pilihan paling tepat dan bernilai tinggi di kelasnya.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
          alt: "iPhone 13 Midnight & Starlight",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        // 128GB - Jual: 8.499.000, Coret: 9.499.000, Modal: 7.649.000
        { sku: "IP13-128-MID-NEW", storage: "128GB", color: "Midnight", price: 8499000, compareAtPrice: 9499000, purchasePrice: 7649000, stock: 15 },
        { sku: "IP13-128-STA-NEW", storage: "128GB", color: "Starlight", price: 8499000, compareAtPrice: 9499000, purchasePrice: 7649000, stock: 12 },
        { sku: "IP13-128-PNK-NEW", storage: "128GB", color: "Pink", price: 8499000, compareAtPrice: 9499000, purchasePrice: 7649000, stock: 8 },
        { sku: "IP13-128-BLU-NEW", storage: "128GB", color: "Blue", price: 8499000, compareAtPrice: 9499000, purchasePrice: 7649000, stock: 7 },
        { sku: "IP13-128-GRN-NEW", storage: "128GB", color: "Green", price: 8499000, compareAtPrice: 9499000, purchasePrice: 7649000, stock: 6 },
        // 256GB - Jual: 10.499.000, Coret: 11.499.000, Modal: 9.449.000
        { sku: "IP13-256-MID-NEW", storage: "256GB", color: "Midnight", price: 10499000, compareAtPrice: 11499000, purchasePrice: 9449000, stock: 7 },
        { sku: "IP13-256-STA-NEW", storage: "256GB", color: "Starlight", price: 10499000, compareAtPrice: 11499000, purchasePrice: 9449000, stock: 6 },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    // B. KATEGORI: iPHONE SECOND (LIKE NEW GRADE A+ EX-iBOX / RESMI)
    // ══════════════════════════════════════════════════════════════════════════
    {
      name: "iPhone 15 Pro Max (Second Like New)",
      slug: "iphone-15-pro-max-second",
      model: "A3106 (Ex-PA/A)",
      categorySlug: "iphone",
      condition: "LIKE_NEW",
      featured: true,
      warranty: "Garansi Toko Gamen Store 30 Hari Tukar Unit",
      description:
        "Unit Second Grade A+ Mulus 98%-99% Seperti Baru (Bukan Rekondisi / Refurbished). Eks Garansi Resmi Indonesia iBox / GDN. Battery Health 90%-100% Original Apple, True Tone ON, Face ID responsif 100%, 3uTools Hijau Semua (Zero Repair History). IMEI resmi terdaftar permanen Kemenperin, sinyal all operator seumur hidup. Termasuk fullset box dan aksesoris.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
          alt: "iPhone 15 Pro Max Second Like New",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        // 256GB - Jual: 17.499.000, Coret: 18.500.000, Modal: 15.749.000
        { sku: "IP15PM-256-NAT-SEC", storage: "256GB", color: "Natural Titanium", price: 17499000, compareAtPrice: 18500000, purchasePrice: 15749000, stock: 7 },
        { sku: "IP15PM-256-BLT-SEC", storage: "256GB", color: "Blue Titanium", price: 17499000, compareAtPrice: 18500000, purchasePrice: 15749000, stock: 5 },
        { sku: "IP15PM-256-WHT-SEC", storage: "256GB", color: "White Titanium", price: 17499000, compareAtPrice: 18500000, purchasePrice: 15749000, stock: 4 },
        { sku: "IP15PM-256-BLK-SEC", storage: "256GB", color: "Black Titanium", price: 17499000, compareAtPrice: 18500000, purchasePrice: 15749000, stock: 6 },
        // 512GB - Jual: 19.499.000, Coret: 20.500.000, Modal: 17.549.000
        { sku: "IP15PM-512-NAT-SEC", storage: "512GB", color: "Natural Titanium", price: 19499000, compareAtPrice: 20500000, purchasePrice: 17549000, stock: 4 },
        { sku: "IP15PM-512-BLT-SEC", storage: "512GB", color: "Blue Titanium", price: 19499000, compareAtPrice: 20500000, purchasePrice: 17549000, stock: 3 },
      ],
    },

    {
      name: "iPhone 15 Pro (Second Like New)",
      slug: "iphone-15-pro-second",
      model: "A3102 (Ex-PA/A)",
      categorySlug: "iphone",
      condition: "LIKE_NEW",
      featured: false,
      warranty: "Garansi Toko Gamen Store 30 Hari Tukar Unit",
      description:
        "Unit Second Grade A+ Mulus 98%-99% Seperti Baru. Eks Garansi Resmi Indonesia (iBox / GDN). Chip A17 Pro super bertenaga, bodi Titanium ringan, Battery Health 92%-98% Original Apple, True Tone & Face ID aktif normal, 3uTools Hijau Semua. IMEI terdaftar resmi Kemenperin permanen, bebas blokir sinyal.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1695048065052-16e792c3a516?w=800&auto=format&fit=crop&q=80",
          alt: "iPhone 15 Pro Second Like New",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        // 128GB - Jual: 14.299.000, Coret: 15.200.000, Modal: 12.869.000
        { sku: "IP15P-128-NAT-SEC", storage: "128GB", color: "Natural Titanium", price: 14299000, compareAtPrice: 15200000, purchasePrice: 12869000, stock: 6 },
        { sku: "IP15P-128-BLT-SEC", storage: "128GB", color: "Blue Titanium", price: 14299000, compareAtPrice: 15200000, purchasePrice: 12869000, stock: 5 },
        { sku: "IP15P-128-BLK-SEC", storage: "128GB", color: "Black Titanium", price: 14299000, compareAtPrice: 15200000, purchasePrice: 12869000, stock: 6 },
        // 256GB - Jual: 15.699.000, Coret: 16.500.000, Modal: 14.129.000
        { sku: "IP15P-256-NAT-SEC", storage: "256GB", color: "Natural Titanium", price: 15699000, compareAtPrice: 16500000, purchasePrice: 14129000, stock: 7 },
        { sku: "IP15P-256-BLK-SEC", storage: "256GB", color: "Black Titanium", price: 15699000, compareAtPrice: 16500000, purchasePrice: 14129000, stock: 5 },
      ],
    },

    {
      name: "iPhone 14 Pro Max (Second Like New)",
      slug: "iphone-14-pro-max-second",
      model: "A2894 (Ex-PA/A)",
      categorySlug: "iphone",
      condition: "LIKE_NEW",
      featured: false,
      warranty: "Garansi Toko Gamen Store 30 Hari Tukar Unit",
      description:
        "Unit Second Grade A+ Mulus 98%-99% Seperti Baru. Eks Garansi Resmi Indonesia (iBox / GDN). Dilengkapi Dynamic Island pertama, kamera Pro 48MP, Always-On Display, dan chip A16 Bionic. Battery Health 90%-97% Original Apple, layar original tidak pernah ganti, 3uTools Hijau Semua. IMEI aman terdaftar resmi.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800&auto=format&fit=crop&q=80",
          alt: "iPhone 14 Pro Max Deep Purple",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        // 128GB - Jual: 13.299.000, Coret: 14.200.000, Modal: 11.969.000
        { sku: "IP14PM-128-PUR-SEC", storage: "128GB", color: "Deep Purple", price: 13299000, compareAtPrice: 14200000, purchasePrice: 11969000, stock: 8 },
        { sku: "IP14PM-128-SBK-SEC", storage: "128GB", color: "Space Black", price: 13299000, compareAtPrice: 14200000, purchasePrice: 11969000, stock: 6 },
        { sku: "IP14PM-128-SLV-SEC", storage: "128GB", color: "Silver", price: 13299000, compareAtPrice: 14200000, purchasePrice: 11969000, stock: 5 },
        { sku: "IP14PM-128-GLD-SEC", storage: "128GB", color: "Gold", price: 13299000, compareAtPrice: 14200000, purchasePrice: 11969000, stock: 4 },
        // 256GB - Jual: 14.499.000, Coret: 15.500.000, Modal: 13.049.000
        { sku: "IP14PM-256-PUR-SEC", storage: "256GB", color: "Deep Purple", price: 14499000, compareAtPrice: 15500000, purchasePrice: 13049000, stock: 6 },
        { sku: "IP14PM-256-SBK-SEC", storage: "256GB", color: "Space Black", price: 14499000, compareAtPrice: 15500000, purchasePrice: 13049000, stock: 6 },
      ],
    },

    {
      name: "iPhone 14 Pro (Second Like New)",
      slug: "iphone-14-pro-second",
      model: "A2890 (Ex-PA/A)",
      categorySlug: "iphone",
      condition: "LIKE_NEW",
      featured: false,
      warranty: "Garansi Toko Gamen Store 30 Hari Tukar Unit",
      description:
        "Unit Second Grade A+ Mulus 98%-99% Seperti Baru. Eks Garansi Resmi Indonesia (iBox / GDN). Layar ProMotion 120Hz super mulus dengan Dynamic Island, bodi Stainless Steel mewah, Battery Health 91%-97% Original Apple. True Tone & Face ID responsif 100%. IMEI terdaftar permanen Bea Cukai / Kemenperin.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&auto=format&fit=crop&q=80",
          alt: "iPhone 14 Pro Space Black",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        // 128GB - Jual: 11.699.000, Coret: 12.500.000, Modal: 10.529.000
        { sku: "IP14P-128-PUR-SEC", storage: "128GB", color: "Deep Purple", price: 11699000, compareAtPrice: 12500000, purchasePrice: 10529000, stock: 6 },
        { sku: "IP14P-128-SBK-SEC", storage: "128GB", color: "Space Black", price: 11699000, compareAtPrice: 12500000, purchasePrice: 10529000, stock: 7 },
        { sku: "IP14P-128-SLV-SEC", storage: "128GB", color: "Silver", price: 11699000, compareAtPrice: 12500000, purchasePrice: 10529000, stock: 4 },
        // 256GB - Jual: 12.699.000, Coret: 13.500.000, Modal: 11.429.000
        { sku: "IP14P-256-PUR-SEC", storage: "256GB", color: "Deep Purple", price: 12699000, compareAtPrice: 13500000, purchasePrice: 11429000, stock: 6 },
        { sku: "IP14P-256-SBK-SEC", storage: "256GB", color: "Space Black", price: 12699000, compareAtPrice: 13500000, purchasePrice: 11429000, stock: 5 },
      ],
    },

    {
      name: "iPhone 13 Pro Max (Second Like New)",
      slug: "iphone-13-pro-max-second",
      model: "A2643 (Ex-ID/A)",
      categorySlug: "iphone",
      condition: "LIKE_NEW",
      featured: false,
      warranty: "Garansi Toko Gamen Store 30 Hari Tukar Unit",
      description:
        "Unit Second Grade A+ Mulus 98%-99% Seperti Baru. Eks Garansi Resmi Indonesia (iBox / GDN). Layar Super Retina XDR 6.7 inci ProMotion 120Hz, daya tahan baterai legendaris paling awet di kelasnya, kamera Cinematic Mode 3x Optical Zoom. Battery Health 90%-96% Original Apple. 3uTools Hijau Semua, IMEI aman bebas blokir.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&auto=format&fit=crop&q=80",
          alt: "iPhone 13 Pro Max Sierra Blue",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        // 128GB - Jual: 10.499.000, Coret: 11.200.000, Modal: 9.449.000
        { sku: "IP13PM-128-SBL-SEC", storage: "128GB", color: "Sierra Blue", price: 10499000, compareAtPrice: 11200000, purchasePrice: 9449000, stock: 7 },
        { sku: "IP13PM-128-GRP-SEC", storage: "128GB", color: "Graphite", price: 10499000, compareAtPrice: 11200000, purchasePrice: 9449000, stock: 6 },
        { sku: "IP13PM-128-ALP-SEC", storage: "128GB", color: "Alpine Green", price: 10499000, compareAtPrice: 11200000, purchasePrice: 9449000, stock: 4 },
        { sku: "IP13PM-128-SLV-SEC", storage: "128GB", color: "Silver", price: 10499000, compareAtPrice: 11200000, purchasePrice: 9449000, stock: 4 },
        // 256GB - Jual: 11.499.000, Coret: 12.300.000, Modal: 10.349.000
        { sku: "IP13PM-256-SBL-SEC", storage: "256GB", color: "Sierra Blue", price: 11499000, compareAtPrice: 12300000, purchasePrice: 10349000, stock: 6 },
        { sku: "IP13PM-256-GRP-SEC", storage: "256GB", color: "Graphite", price: 11499000, compareAtPrice: 12300000, purchasePrice: 10349000, stock: 5 },
      ],
    },

    {
      name: "iPhone 13 (Second Like New)",
      slug: "iphone-13-second",
      model: "A2633 (Ex-ID/A)",
      categorySlug: "iphone",
      condition: "LIKE_NEW",
      featured: false,
      warranty: "Garansi Toko Gamen Store 30 Hari Tukar Unit",
      description:
        "Unit Second Grade A+ Mulus 98%-99% Seperti Baru. Eks Garansi Resmi Indonesia (iBox / GDN). Performa chip A15 Bionic super stabil, kamera tajam dengan Cinematic Mode, Battery Health 91%-97% Original Apple. True Tone & Face ID aktif 100%. IMEI terdaftar permanen Kemenperin, sinyal all operator aman selamanya.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
          alt: "iPhone 13 Second Pink & Midnight",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        // 128GB - Jual: 6.999.000, Coret: 7.699.000, Modal: 6.299.000
        { sku: "IP13-128-PNK-SEC", storage: "128GB", color: "Pink", price: 6999000, compareAtPrice: 7699000, purchasePrice: 6299000, stock: 10 },
        { sku: "IP13-128-STA-SEC", storage: "128GB", color: "Starlight", price: 6999000, compareAtPrice: 7699000, purchasePrice: 6299000, stock: 8 },
        { sku: "IP13-128-MID-SEC", storage: "128GB", color: "Midnight", price: 6999000, compareAtPrice: 7699000, purchasePrice: 6299000, stock: 9 },
        { sku: "IP13-128-BLU-SEC", storage: "128GB", color: "Blue", price: 6999000, compareAtPrice: 7699000, purchasePrice: 6299000, stock: 6 },
        // 256GB - Jual: 7.899.000, Coret: 8.599.000, Modal: 7.109.000
        { sku: "IP13-256-MID-SEC", storage: "256GB", color: "Midnight", price: 7899000, compareAtPrice: 8599000, purchasePrice: 7109000, stock: 7 },
        { sku: "IP13-256-STA-SEC", storage: "256GB", color: "Starlight", price: 7899000, compareAtPrice: 8599000, purchasePrice: 7109000, stock: 6 },
      ],
    },

    {
      name: "iPhone 12 (Second Like New)",
      slug: "iphone-12-second",
      model: "A2403 (Ex-ID/A)",
      categorySlug: "iphone",
      condition: "LIKE_NEW",
      featured: false,
      warranty: "Garansi Toko Gamen Store 30 Hari Tukar Unit",
      description:
        "Unit Second Grade A+ Mulus 98%-99% Seperti Baru. Eks Garansi Resmi Indonesia (iBox / GDN). Desain flat-edge modern berbalut Ceramic Shield kokoh, layar OLED Super Retina XDR jernih, dukungan sinyal 5G kencang, dan MagSafe wireless charging. Battery Health 90%-96% Original Apple. 3uTools Hijau Semua, bebas blokir sinyal.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&auto=format&fit=crop&q=80",
          alt: "iPhone 12 Purple & Blue",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        // 64GB - Jual: 4.899.000, Coret: 5.499.000, Modal: 4.409.000
        { sku: "IP12-64-PRP-SEC", storage: "64GB", color: "Purple", price: 4899000, compareAtPrice: 5499000, purchasePrice: 4409000, stock: 8 },
        { sku: "IP12-64-WHT-SEC", storage: "64GB", color: "White", price: 4899000, compareAtPrice: 5499000, purchasePrice: 4409000, stock: 7 },
        { sku: "IP12-64-BLK-SEC", storage: "64GB", color: "Black", price: 4899000, compareAtPrice: 5499000, purchasePrice: 4409000, stock: 8 },
        { sku: "IP12-64-BLU-SEC", storage: "64GB", color: "Blue", price: 4899000, compareAtPrice: 5499000, purchasePrice: 4409000, stock: 6 },
        // 128GB - Jual: 5.599.000, Coret: 6.299.000, Modal: 5.039.000
        { sku: "IP12-128-PRP-SEC", storage: "128GB", color: "Purple", price: 5599000, compareAtPrice: 6299000, purchasePrice: 5039000, stock: 7 },
        { sku: "IP12-128-WHT-SEC", storage: "128GB", color: "White", price: 5599000, compareAtPrice: 6299000, purchasePrice: 5039000, stock: 8 },
        { sku: "IP12-128-BLK-SEC", storage: "128GB", color: "Black", price: 5599000, compareAtPrice: 6299000, purchasePrice: 5039000, stock: 9 },
      ],
    },

    {
      name: "iPhone 11 (Second Like New)",
      slug: "iphone-11-second",
      model: "A2221 (Ex-PA/A)",
      categorySlug: "iphone",
      condition: "LIKE_NEW",
      featured: false,
      warranty: "Garansi Toko Gamen Store 30 Hari Tukar Unit",
      description:
        "Unit Second Grade A+ Mulus 98%-99% Seperti Baru — The Budget King! Eks Garansi Resmi Indonesia (iBox / GDN). Sangat cocok untuk pelajar, konten kreator pemula, maupun daily driver handal. Kamera Ultra Wide jernih, baterai tahan lama, dan chip A13 Bionic yang terbukti tangguh. Battery Health 90%-96% Original Apple. 3uTools Hijau Semua, IMEI aman terdaftar.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1574755393849-623942496936?w=800&auto=format&fit=crop&q=80",
          alt: "iPhone 11 White & Purple",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        // 64GB - Jual: 3.799.000, Coret: 4.299.000, Modal: 3.419.000
        { sku: "IP11-64-WHT-SEC", storage: "64GB", color: "White", price: 3799000, compareAtPrice: 4299000, purchasePrice: 3419000, stock: 12 },
        { sku: "IP11-64-BLK-SEC", storage: "64GB", color: "Black", price: 3799000, compareAtPrice: 4299000, purchasePrice: 3419000, stock: 14 },
        { sku: "IP11-64-PRP-SEC", storage: "64GB", color: "Purple", price: 3799000, compareAtPrice: 4299000, purchasePrice: 3419000, stock: 8 },
        { sku: "IP11-64-GRN-SEC", storage: "64GB", color: "Green", price: 3799000, compareAtPrice: 4299000, purchasePrice: 3419000, stock: 7 },
        // 128GB - Jual: 4.399.000, Coret: 4.899.000, Modal: 3.959.000
        { sku: "IP11-128-WHT-SEC", storage: "128GB", color: "White", price: 4399000, compareAtPrice: 4899000, purchasePrice: 3959000, stock: 10 },
        { sku: "IP11-128-BLK-SEC", storage: "128GB", color: "Black", price: 4399000, compareAtPrice: 4899000, purchasePrice: 3959000, stock: 12 },
        { sku: "IP11-128-PRP-SEC", storage: "128GB", color: "Purple", price: 4399000, compareAtPrice: 4899000, purchasePrice: 3959000, stock: 8 },
      ],
    },

    // ══════════════════════════════════════════════════════════════════════════
    // C. KATEGORI: AKSESORIS ORIGINAL (ACCESSORIES)
    // ══════════════════════════════════════════════════════════════════════════
    {
      name: "Apple 20W USB-C Power Adapter Original (Resmi iBox)",
      slug: "apple-20w-usbc-power-adapter",
      model: "MHJE3ID/A",
      categorySlug: "accessories",
      condition: "NEW",
      featured: false,
      warranty: "1 Tahun Garansi Resmi Apple Indonesia",
      description:
        "Adaptor Daya USB-C Apple 20W Original Garansi Resmi Indonesia (iBox / Digimap). Menawarkan pengisian daya cepat (Fast Charging 50% dalam 30 menit) yang aman dan efisien untuk iPhone 8 hingga iPhone 16 Series. Dilengkapi kode serial number unik pada kemasan dan port.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
          alt: "Apple 20W USB-C Power Adapter Original",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        { sku: "ACC-20W-ADAPTER", storage: "Standard", color: "White", price: 399000, compareAtPrice: 499000, purchasePrice: 349000, stock: 25 },
      ],
    },

    {
      name: "AirPods Pro (2nd Generation) with MagSafe Case (USB-C) Resmi",
      slug: "airpods-pro-2nd-gen-usbc",
      model: "MTJV3ID/A",
      categorySlug: "accessories",
      condition: "NEW",
      featured: false,
      warranty: "1 Tahun Garansi Resmi Apple Indonesia",
      description:
        "AirPods Pro Generasi ke-2 dengan Casing Pengisian Daya MagSafe (USB-C) Original Garansi Resmi Indonesia. Didukung chip Apple H2 dengan Peredam Kebisingan Aktif (ANC) hingga 2x lebih efektif, Audio Spasial personal dengan pelacakan gerakan kepala dinamis, dan ketahanan debu, keringat, serta air IP54.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80",
          alt: "AirPods Pro 2nd Gen USB-C Original",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        { sku: "ACC-AIRPODS-PRO-2", storage: "Standard", color: "White", price: 3499000, compareAtPrice: 3999000, purchasePrice: 3099000, stock: 10 },
      ],
    },

    {
      name: "Apple MagSafe Charger Original",
      slug: "apple-magsafe-charger-original",
      model: "MHXH3ID/A",
      categorySlug: "accessories",
      condition: "NEW",
      featured: false,
      warranty: "1 Tahun Garansi Resmi Apple Indonesia",
      description:
        "Pengisi Daya Nirkabel Apple MagSafe Original Garansi Resmi Indonesia. Magnet yang selaras sempurna menempel langsung ke iPhone 12 hingga iPhone 16 Series Anda untuk pengisian daya nirkabel yang lebih cepat dan presisi hingga 15W. Kompatibel juga dengan pengisian daya standar Qi.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80",
          alt: "Apple MagSafe Charger Original",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        { sku: "ACC-MAGSAFE-CHARGER", storage: "1 Meter", color: "Silver / White", price: 649000, compareAtPrice: 799000, purchasePrice: 569000, stock: 15 },
      ],
    },

    {
      name: "Clear Case with MagSafe for iPhone 15 / 16 Series",
      slug: "clear-case-magsafe-iphone-15-16",
      model: "MHLM3FE/A",
      categorySlug: "accessories",
      condition: "NEW",
      featured: false,
      warranty: "1 Tahun Garansi Resmi Apple Indonesia",
      description:
        "Casing Bening Asli dengan MagSafe untuk iPhone 15 & 16 Series. Dibuat dengan perpaduan polikarbonat bening optik dan bahan fleksibel, casing ini pas di atas tombol agar mudah digunakan. Lapisan anti gores di bagian dalam dan luar, serta dioptimalkan untuk mencegah penguningan seiring waktu.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80",
          alt: "Clear Case with MagSafe Original",
          isPrimary: true,
          sortOrder: 1,
        },
      ],
      variants: [
        { sku: "ACC-MAGSAFE-CLEARCASE", storage: "Standard", color: "Clear", price: 499000, compareAtPrice: 699000, purchasePrice: 419000, stock: 20 },
      ],
    },
  ];

  const variantsBySku = {};

  for (const prodData of productsData) {
    const category = categories[prodData.categorySlug];

    const product = await prisma.product.upsert({
      where: { slug: prodData.slug },
      update: {
        name: prodData.name,
        model: prodData.model,
        description: prodData.description,
        warranty: prodData.warranty,
        condition: prodData.condition,
        featured: prodData.featured,
        categoryId: category.id,
        active: true,
      },
      create: {
        name: prodData.name,
        slug: prodData.slug,
        model: prodData.model,
        description: prodData.description,
        warranty: prodData.warranty,
        condition: prodData.condition,
        featured: prodData.featured,
        categoryId: category.id,
        active: true,
      },
    });

    // Sync Images
    for (let idx = 0; idx < prodData.images.length; idx++) {
      const img = prodData.images[idx];
      const existingImg = await prisma.productImage.findFirst({
        where: { productId: product.id, url: img.url },
      });
      if (existingImg) {
        await prisma.productImage.update({
          where: { id: existingImg.id },
          data: {
            alt: img.alt,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder || idx + 1,
          },
        });
      } else {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: img.url,
            alt: img.alt,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder || idx + 1,
          },
        });
      }
    }

    // Sync Variants
    for (const v of prodData.variants) {
      const variant = await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          purchasePrice: v.purchasePrice,
          storage: v.storage,
          color: v.color,
          stock: v.stock,
          active: true,
        },
        create: {
          productId: product.id,
          sku: v.sku,
          storage: v.storage,
          color: v.color,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          purchasePrice: v.purchasePrice,
          stock: v.stock,
          active: true,
        },
      });
      variantsBySku[v.sku] = variant;
    }
  }
  console.log(`   ✓ ${productsData.length} Products and ${Object.keys(variantsBySku).length} Variants seeded.`);

  // ─── 5. Suppliers ─────────────────────────────────────────────────────────────
  console.log("🏢 5. Seeding Suppliers...");
  const suppliersData = [
    {
      name: "PT Sinar Apple Mandiri",
      contactPerson: "Budi Santoso",
      whatsapp: "081122334455",
      email: "order@sinarapplemandiri.co.id",
      address: "Ruko ITC Roxy Mas Blok D2 No. 15, Gambir, Jakarta Pusat",
      notes: "Distributor utama unit iPhone segel resmi iBox / GDN & klaim garansi cepat.",
    },
    {
      name: "CV Gadget Nusantara Jaya",
      contactPerson: "Hendra Wijaya",
      whatsapp: "081233445566",
      email: "supply@gadgetnusantara.com",
      address: "Komplek Plaza Marina Lt. 3 No. 42, Wonokromo, Surabaya",
      notes: "Supplier spesialis unit iPhone Second Grade A+ Like New & aksesoris Apple original.",
    },
    {
      name: "iDistribution Global ID",
      contactPerson: "Kevin Pratama",
      whatsapp: "081344556677",
      email: "kevin@idistribution.id",
      address: "Ruko Sentra Niaga Puri Indah Blok T6 No. 8, Jakarta Barat",
      notes: "Supplier unit resmi Bea Cukai dan IMEI permanen Kemenperin.",
    },
  ];

  const suppliers = [];
  for (const s of suppliersData) {
    const existing = await prisma.supplier.findFirst({ where: { name: s.name } });
    if (existing) {
      const updated = await prisma.supplier.update({
        where: { id: existing.id },
        data: s,
      });
      suppliers.push(updated);
    } else {
      const created = await prisma.supplier.create({ data: s });
      suppliers.push(created);
    }
  }
  console.log(`   ✓ ${suppliers.length} Suppliers seeded.`);

  // ─── 6. Customers ─────────────────────────────────────────────────────────────
  console.log("👥 6. Seeding Customers...");
  const customersData = [
    {
      name: "Rizky Ramadhan",
      whatsapp: "081298765432",
      email: "rizky.ramadhan@gmail.com",
      province: "DKI Jakarta",
      city: "Jakarta Selatan",
      district: "Kebayoran Baru",
      postalCode: "12180",
      address: "Jl. Senopati No. 45, RT 02 / RW 03",
      notes: "Pelanggan repeat order, prioritas kirim Instant Courier.",
    },
    {
      name: "Anisa Maharani",
      whatsapp: "081387654321",
      email: "anisa.maharani@yahoo.com",
      province: "Jawa Barat",
      city: "Bandung",
      district: "Coblong",
      postalCode: "40132",
      address: "Jl. Dago Asri No. 12B, Dago",
      notes: "Minta packing kayu tambahan dan asuransi penuh.",
    },
    {
      name: "Dimas Prasetyo",
      whatsapp: "081776543210",
      email: "dimas.prasetyo@outlook.com",
      province: "Jawa Timur",
      city: "Surabaya",
      district: "Gubeng",
      postalCode: "60281",
      address: "Jl. Raya Gubeng No. 88, Kav 4",
      notes: "Pelanggan VIP Gamen Store.",
    },
    {
      name: "Siti Nurhaliza",
      whatsapp: "081865432109",
      email: "siti.nurhaliza@gmail.com",
      province: "DI Yogyakarta",
      city: "Yogyakarta",
      district: "Depok (Sleman)",
      postalCode: "55281",
      address: "Jl. Kaliurang KM 5.5 No. 20",
      notes: "COD / Ambil di store partner Jogja.",
    },
    {
      name: "Fajar Nugroho",
      whatsapp: "081954321098",
      email: "fajar.nugroho@techcorp.id",
      province: "Jawa Tengah",
      city: "Semarang",
      district: "Semarang Barat",
      postalCode: "50148",
      address: "Jl. Pamularsih Raya No. 34",
      notes: "Order unit untuk kantor / faktur pajak diminta.",
    },
  ];

  const customers = [];
  for (const c of customersData) {
    const existing = await prisma.customer.findFirst({ where: { whatsapp: c.whatsapp } });
    if (existing) {
      const updated = await prisma.customer.update({
        where: { id: existing.id },
        data: c,
      });
      customers.push(updated);
    } else {
      const created = await prisma.customer.create({ data: c });
      customers.push(created);
    }
  }
  console.log(`   ✓ ${customers.length} Customers seeded.`);

  // ─── 7. Finance Categories ────────────────────────────────────────────────────
  console.log("💳 7. Seeding Finance Categories...");
  const finCategoriesData = [
    { name: "Penjualan Unit iPhone", type: "INCOME", description: "Pendapatan dari penjualan unit iPhone" },
    { name: "Jasa Servis & Aksesoris", type: "INCOME", description: "Pendapatan jasa servis dan penjualan aksesoris" },
    { name: "Pendapatan Lain-lain", type: "INCOME", description: "Pendapatan non-operasional lainnya" },
    { name: "Modal Pemilik", type: "CAPITAL", description: "Injeksi modal dari pemilik atau investor" },
    { name: "Pembelian Stok iPhone", type: "EXPENSE", description: "Pengeluaran pembelian unit iPhone dari supplier" },
    { name: "Biaya Operasional", type: "EXPENSE", description: "Biaya operasional harian toko" },
    { name: "Ongkos Kirim & Logistik", type: "EXPENSE", description: "Biaya pengiriman barang ke customer" },
    { name: "Pemasaran & Iklan", type: "EXPENSE", description: "Biaya iklan dan promosi toko" },
    { name: "Sewa Tempat", type: "EXPENSE", description: "Biaya sewa toko / ruko / gudang" },
    { name: "Listrik & Internet", type: "EXPENSE", description: "Biaya utilitas toko" },
    { name: "Gaji Karyawan", type: "EXPENSE", description: "Gaji staf dan admin" },
    { name: "Pajak", type: "EXPENSE", description: "Pajak usaha" },
    { name: "Pengeluaran Lain-lain", type: "EXPENSE", description: "Biaya lain-lain yang tidak terduga" },
  ];

  const finCategories = {};
  for (const fc of finCategoriesData) {
    finCategories[fc.name] = await prisma.financeCategory.upsert({
      where: { name: fc.name },
      update: { type: fc.type, description: fc.description },
      create: fc,
    });
  }
  console.log(`   ✓ ${Object.keys(finCategories).length} Finance Categories seeded.`);

  // ─── 8. Physical Inventory Units (IMEI, BH, Serial Number) ───────────────────
  console.log("🔢 8. Seeding Physical Inventory Units with verified IMEIs...");
  const inventoryUnitsData = [
    // Unit NEW (BNIB) - BH 100%
    { sku: "IP16PM-256-DST-NEW", imei: "354928110293841", serialNumber: "F17X892KLMN1", condition: "NEW", batteryHealth: 100, cost: 19799000, price: 21999000 },
    { sku: "IP16PM-256-NAT-NEW", imei: "354928110293842", serialNumber: "F17X892KLMN2", condition: "NEW", batteryHealth: 100, cost: 19799000, price: 21999000 },
    { sku: "IP16P-256-NAT-NEW",  imei: "354928110293843", serialNumber: "F17X892KLMN3", condition: "NEW", batteryHealth: 100, cost: 18449000, price: 20499000 },
    { sku: "IP16-128-BLU-NEW",   imei: "354928110293844", serialNumber: "F17X892KLMN4", condition: "NEW", batteryHealth: 100, cost: 13049000, price: 14499000 },
    { sku: "IP15-128-BLK-NEW",   imei: "354928110293845", serialNumber: "F17X892KLMN5", condition: "NEW", batteryHealth: 100, cost: 11024000, price: 12249000 },
    { sku: "IP13-128-MID-NEW",   imei: "354928110293846", serialNumber: "F17X892KLMN6", condition: "NEW", batteryHealth: 100, cost: 7649000,  price: 8499000 },

    // Unit SECOND (LIKE_NEW) - BH 90%-98%
    { sku: "IP15PM-256-NAT-SEC", imei: "358920194837201", serialNumber: "DX3H89Q9PLM1", condition: "LIKE_NEW", batteryHealth: 98, cost: 15749000, price: 17499000 },
    { sku: "IP15PM-256-BLT-SEC", imei: "358920194837202", serialNumber: "DX3H89Q9PLM2", condition: "LIKE_NEW", batteryHealth: 96, cost: 15749000, price: 17499000 },
    { sku: "IP15P-128-NAT-SEC",  imei: "358920194837203", serialNumber: "DX3H89Q9PLM3", condition: "LIKE_NEW", batteryHealth: 95, cost: 12869000, price: 14299000 },
    { sku: "IP14PM-128-PUR-SEC", imei: "358920194837204", serialNumber: "G6TJ90L1KLP1", condition: "LIKE_NEW", batteryHealth: 94, cost: 11969000, price: 13299000 },
    { sku: "IP14P-128-PUR-SEC",  imei: "358920194837205", serialNumber: "G6TJ90L1KLP2", condition: "LIKE_NEW", batteryHealth: 93, cost: 10529000, price: 11699000 },
    { sku: "IP13PM-128-SBL-SEC", imei: "358920194837206", serialNumber: "H8KM49L0OPQ1", condition: "LIKE_NEW", batteryHealth: 92, cost: 9449000,  price: 10499000 },
    { sku: "IP13-128-PNK-SEC",   imei: "358920194837207", serialNumber: "H8KM49L0OPQ2", condition: "LIKE_NEW", batteryHealth: 94, cost: 6299000,  price: 6999000 },
    { sku: "IP12-64-PRP-SEC",    imei: "358920194837208", serialNumber: "J9NP38M7RST1", condition: "LIKE_NEW", batteryHealth: 91, cost: 4409000,  price: 4899000 },
    { sku: "IP11-64-WHT-SEC",    imei: "358920194837209", serialNumber: "K0QR27N6UVW1", condition: "LIKE_NEW", batteryHealth: 93, cost: 3419000,  price: 3799000 },
  ];

  const inventoryUnitsByImei = {};
  for (const u of inventoryUnitsData) {
    const variant = variantsBySku[u.sku];
    if (!variant) continue;

    const unit = await prisma.inventoryUnit.upsert({
      where: { imei: u.imei },
      update: {
        condition: u.condition,
        batteryHealth: u.batteryHealth,
        purchasePrice: u.cost,
        sellingPrice: u.price,
        status: "AVAILABLE",
      },
      create: {
        variantId: variant.id,
        imei: u.imei,
        serialNumber: u.serialNumber,
        condition: u.condition,
        batteryHealth: u.batteryHealth,
        purchasePrice: u.cost,
        sellingPrice: u.price,
        status: "AVAILABLE",
        notes: u.condition === "NEW" ? "BNIB Segel Resmi Green Peel" : "Grade A+ Like New Ex-iBox, 3uTools Hijau Semua",
      },
    });
    inventoryUnitsByImei[u.imei] = unit;
  }
  console.log(`   ✓ ${Object.keys(inventoryUnitsByImei).length} Physical Inventory Units seeded.`);

  // ─── 9. Purchases (Stock POs) ─────────────────────────────────────────────────
  console.log("📥 9. Seeding Purchases...");
  const purchase1 = await prisma.purchase.upsert({
    where: { purchaseNumber: "PO-202610-001" },
    update: {},
    create: {
      purchaseNumber: "PO-202610-001",
      supplierId: suppliers[0].id,
      purchaseDate: new Date("2026-10-05T10:00:00Z"),
      invoiceNumber: "INV-SAM-202610-01",
      paymentMethod: "BANK_TRANSFER",
      totalAmount: "125600000",
      status: "CONFIRMED",
      notes: "Pembelian batch iPhone 16 Series BNIB & Aksesoris Apple Resmi.",
      items: {
        create: [
          { variantId: variantsBySku["IP16PM-256-DST-NEW"].id, quantity: 2, purchasePrice: 19799000, totalPrice: 39598000 },
          { variantId: variantsBySku["IP16P-256-NAT-NEW"].id, quantity: 2, purchasePrice: 18449000, totalPrice: 36898000 },
          { variantId: variantsBySku["IP16-128-BLU-NEW"].id, quantity: 2, purchasePrice: 13049000, totalPrice: 26098000 },
          { variantId: variantsBySku["ACC-20W-ADAPTER"].id, quantity: 20, purchasePrice: 349000, totalPrice: 6980000 },
          { variantId: variantsBySku["ACC-AIRPODS-PRO-2"].id, quantity: 5, purchasePrice: 3099000, totalPrice: 15495000 },
        ],
      },
    },
  });

  const purchase2 = await prisma.purchase.upsert({
    where: { purchaseNumber: "PO-202610-002" },
    update: {},
    create: {
      purchaseNumber: "PO-202610-002",
      supplierId: suppliers[1].id,
      purchaseDate: new Date("2026-10-12T14:30:00Z"),
      invoiceNumber: "INV-GNJ-202610-44",
      paymentMethod: "BANK_TRANSFER",
      totalAmount: "85400000",
      status: "CONFIRMED",
      notes: "Restock unit Second Like New Grade A+ Ex-iBox pilihan Surabaya hub.",
      items: {
        create: [
          { variantId: variantsBySku["IP15PM-256-NAT-SEC"].id, quantity: 2, purchasePrice: 15749000, totalPrice: 31498000 },
          { variantId: variantsBySku["IP14PM-128-PUR-SEC"].id, quantity: 2, purchasePrice: 11969000, totalPrice: 23938000 },
          { variantId: variantsBySku["IP13-128-PNK-SEC"].id, quantity: 3, purchasePrice: 6299000, totalPrice: 18897000 },
          { variantId: variantsBySku["IP11-64-WHT-SEC"].id, quantity: 3, purchasePrice: 3419000, totalPrice: 10257000 },
        ],
      },
    },
  });
  console.log("   ✓ 2 Purchases seeded.");

  // ─── 10. Customer Orders ──────────────────────────────────────────────────────
  console.log("🛒 10. Seeding Realistic Customer Orders...");
  const order1 = await prisma.order.upsert({
    where: { orderNumber: "ORD-202610-001" },
    update: {},
    create: {
      orderNumber: "ORD-202610-001",
      customerId: customers[0].id,
      deliveryMethod: "DELIVERY",
      address: "Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan",
      shippingCost: 0,
      subtotal: 22398000,
      discount: 0,
      total: 22398000,
      status: "COMPLETED",
      notes: "Order iPhone 16 Pro Max Desert Titanium + Adapter 20W. Pembayaran lunas via BCA.",
      items: {
        create: [
          {
            variantId: variantsBySku["IP16PM-256-DST-NEW"].id,
            productNameSnapshot: "iPhone 16 Pro Max",
            variantSnapshot: "256GB - Desert Titanium",
            quantity: 1,
            sellingPrice: 21999000,
            purchaseCost: 19799000,
            total: 21999000,
          },
          {
            variantId: variantsBySku["ACC-20W-ADAPTER"].id,
            productNameSnapshot: "Apple 20W USB-C Power Adapter Original",
            variantSnapshot: "Standard - White",
            quantity: 1,
            sellingPrice: 399000,
            purchaseCost: 349000,
            total: 399000,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.upsert({
    where: { orderNumber: "ORD-202610-002" },
    update: {},
    create: {
      orderNumber: "ORD-202610-002",
      customerId: customers[1].id,
      deliveryMethod: "DELIVERY",
      address: "Jl. Dago Asri No. 12B, Dago, Bandung",
      shippingCost: 50000,
      subtotal: 17499000,
      discount: 0,
      total: 17549000,
      status: "SHIPPED",
      notes: "iPhone 15 Pro Max Natural Titanium Second Like New. Kirim via JNE YES + Asuransi.",
      items: {
        create: [
          {
            variantId: variantsBySku["IP15PM-256-NAT-SEC"].id,
            productNameSnapshot: "iPhone 15 Pro Max (Second Like New)",
            variantSnapshot: "256GB - Natural Titanium",
            quantity: 1,
            sellingPrice: 17499000,
            purchaseCost: 15749000,
            total: 17499000,
          },
        ],
      },
    },
  });

  const order3 = await prisma.order.upsert({
    where: { orderNumber: "ORD-202610-003" },
    update: {},
    create: {
      orderNumber: "ORD-202610-003",
      customerId: customers[2].id,
      deliveryMethod: "PICKUP",
      shippingCost: 0,
      subtotal: 14499000,
      discount: 0,
      total: 14499000,
      status: "PROCESSING",
      notes: "Ambil langsung di store Gamen Store.",
      items: {
        create: [
          {
            variantId: variantsBySku["IP16-128-BLU-NEW"].id,
            productNameSnapshot: "iPhone 16",
            variantSnapshot: "128GB - Ultramarine",
            quantity: 1,
            sellingPrice: 14499000,
            purchaseCost: 13049000,
            total: 14499000,
          },
        ],
      },
    },
  });

  const order4 = await prisma.order.upsert({
    where: { orderNumber: "ORD-202610-004" },
    update: {},
    create: {
      orderNumber: "ORD-202610-004",
      customerId: customers[3].id,
      deliveryMethod: "DELIVERY",
      address: "Jl. Kaliurang KM 5.5 No. 20, Yogyakarta",
      shippingCost: 35000,
      subtotal: 12249000,
      discount: 0,
      total: 12284000,
      status: "CONFIRMED",
      notes: "Menunggu konfirmasi admin untuk jadwal pengiriman.",
      items: {
        create: [
          {
            variantId: variantsBySku["IP15-128-BLK-NEW"].id,
            productNameSnapshot: "iPhone 15",
            variantSnapshot: "128GB - Black",
            quantity: 1,
            sellingPrice: 12249000,
            purchaseCost: 11024000,
            total: 12249000,
          },
        ],
      },
    },
  });

  const order5 = await prisma.order.upsert({
    where: { orderNumber: "ORD-202610-005" },
    update: {},
    create: {
      orderNumber: "ORD-202610-005",
      customerId: customers[4].id,
      deliveryMethod: "DELIVERY",
      address: "Jl. Pamularsih Raya No. 34, Semarang",
      shippingCost: 0,
      subtotal: 8499000,
      discount: 0,
      total: 8499000,
      status: "PENDING",
      notes: "Checkout baru via website, menunggu konfirmasi WhatsApp.",
      items: {
        create: [
          {
            variantId: variantsBySku["IP13-128-MID-NEW"].id,
            productNameSnapshot: "iPhone 13",
            variantSnapshot: "128GB - Midnight",
            quantity: 1,
            sellingPrice: 8499000,
            purchaseCost: 7649000,
            total: 8499000,
          },
        ],
      },
    },
  });
  console.log("   ✓ 5 Realistic Orders (COMPLETED, SHIPPED, PROCESSING, CONFIRMED, PENDING) seeded.");

  // ─── 11. Finance Transactions ─────────────────────────────────────────────────
  console.log("💰 11. Seeding Finance Transactions (Cash Flow & COGS)...");
  const transactionsData = [
    // Modal Awal
    {
      categoryId: finCategories["Modal Pemilik"].id,
      type: "CAPITAL",
      amount: "300000000",
      date: new Date("2026-10-01T08:00:00Z"),
      paymentMethod: "BANK_TRANSFER",
      reference: "CAP-2026-001",
      description: "Setoran modal awal ekspansi usaha Gamen Store dari Founder & Partner.",
    },
    // PO 1 Pengeluaran
    {
      categoryId: finCategories["Pembelian Stok iPhone"].id,
      type: "EXPENSE",
      amount: "125600000",
      date: new Date("2026-10-05T11:00:00Z"),
      paymentMethod: "BANK_TRANSFER",
      reference: "PO-202610-001",
      description: "Pembayaran kulakan stok iPhone 16 Series BNIB ke PT Sinar Apple Mandiri.",
      purchaseId: purchase1.id,
    },
    // PO 2 Pengeluaran
    {
      categoryId: finCategories["Pembelian Stok iPhone"].id,
      type: "EXPENSE",
      amount: "85400000",
      date: new Date("2026-10-12T15:00:00Z"),
      paymentMethod: "BANK_TRANSFER",
      reference: "PO-202610-002",
      description: "Pembayaran kulakan stok iPhone Second Like New ke CV Gadget Nusantara Jaya.",
      purchaseId: purchase2.id,
    },
    // Order 1 Pemasukan Penjualan
    {
      categoryId: finCategories["Penjualan Unit iPhone"].id,
      type: "INCOME",
      amount: "22398000",
      date: new Date("2026-10-15T16:00:00Z"),
      paymentMethod: "BANK_TRANSFER",
      reference: "ORD-202610-001",
      description: "Penerimaan pembayaran lunas Order ORD-202610-001 (iPhone 16 Pro Max + Adapter 20W).",
      orderId: order1.id,
    },
    // Order 2 Pemasukan Penjualan
    {
      categoryId: finCategories["Penjualan Unit iPhone"].id,
      type: "INCOME",
      amount: "17549000",
      date: new Date("2026-10-18T09:45:00Z"),
      paymentMethod: "BANK_TRANSFER",
      reference: "ORD-202610-002",
      description: "Penerimaan pembayaran lunas Order ORD-202610-002 (iPhone 15 Pro Max Second Like New).",
      orderId: order2.id,
    },
    // Beban Operasional: Sewa Store & Ruko
    {
      categoryId: finCategories["Sewa Tempat"].id,
      type: "EXPENSE",
      amount: "15000000",
      date: new Date("2026-10-02T10:00:00Z"),
      paymentMethod: "BANK_TRANSFER",
      reference: "EXP-RENT-1026",
      description: "Pembayaran sewa store & showroom Gamen Store Senopati Jakarta Selatan.",
    },
    // Beban Iklan & Marketing
    {
      categoryId: finCategories["Pemasaran & Iklan"].id,
      type: "EXPENSE",
      amount: "4500000",
      date: new Date("2026-10-08T13:00:00Z"),
      paymentMethod: "E_WALLET",
      reference: "EXP-ADS-1026",
      description: "Biaya promosi dan iklan Instagram/TikTok Ads peluncuran iPhone 16 Series.",
    },
    // Beban Listrik & Internet
    {
      categoryId: finCategories["Listrik & Internet"].id,
      type: "EXPENSE",
      amount: "1350000",
      date: new Date("2026-10-20T09:00:00Z"),
      paymentMethod: "BANK_TRANSFER",
      reference: "EXP-UTIL-1026",
      description: "Tagihan listrik PLN 5500VA dan internet IndiBiz optik kecepatan tinggi untuk toko.",
    },
  ];

  for (const trx of transactionsData) {
    const existing = await prisma.financeTransaction.findFirst({
      where: { reference: trx.reference },
    });
    if (!existing) {
      await prisma.financeTransaction.create({ data: trx });
    }
  }
  console.log(`   ✓ ${transactionsData.length} Finance Transactions seeded.`);

  console.log("\n🎉 Gamen Store database seeding completed successfully with full relational integrity!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
