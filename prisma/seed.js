/**
 * Prisma Seed Script — Gamen Store
 *
 * Populates realistic initial data for development:
 * - Categories (iPhone & Accessories)
 * - Products (iPhone 15/16 lineup + accessories)
 * - Product Variants (multiple storages, colors, IDR pricing)
 * - Suppliers (3 certified distributors)
 * - Customers (5 Indonesian customers)
 * - Purchases (Purchase Orders with item breakdown)
 * - Inventory Units (15 physical units with IMEI & serial numbers)
 * - Customer Orders (5 orders in various realistic statuses)
 * - Finance Categories & Realistic Transactions (Capital, Revenue, Expenses)
 *
 * Idempotent: can be executed multiple times without duplicate key errors.
 * Run with: npm run db:seed
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Gamen Store database seeding...\n");

  // ─── 1. Product Categories ────────────────────────────────────────────────────
  console.log("📦 1. Seeding Categories...");
  const categoriesData = [
    {
      name: "iPhone",
      slug: "iphone",
      description: "Smartphone flagship Apple iPhone original dan bergaransi resmi.",
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Aksesoris original Apple, charger, kabel data, dan casing.",
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

  // ─── 2. Products ─────────────────────────────────────────────────────────────
  console.log("📱 2. Seeding Products & Variants...");
  const productsData = [
    {
      name: "iPhone 16 Pro Max",
      slug: "iphone-16-pro-max",
      model: "A3296",
      categorySlug: "iphone",
      description: "iPhone 16 Pro Max dengan chip A18 Pro bertenaga tinggi, bodi Titanium Grade 5, Camera Control baru, dan daya tahan baterai terbaik di kelasnya.",
      warranty: "1 Tahun Garansi Resmi Apple / Beacukai",
      condition: "NEW",
      featured: true,
      images: [
        { url: "/images/products/iphone-16-pro-max-desert.png", alt: "iPhone 16 Pro Max Desert Titanium", isPrimary: true, sortOrder: 1 },
        { url: "/images/products/iphone-16-pro-max-natural.png", alt: "iPhone 16 Pro Max Natural Titanium", isPrimary: false, sortOrder: 2 },
      ],
      variants: [
        { sku: "IPH16PM-256-DST", storage: "256GB", color: "Desert Titanium", price: "24999000", purchasePrice: "22100000", stock: 5 },
        { sku: "IPH16PM-256-NAT", storage: "256GB", color: "Natural Titanium", price: "24999000", purchasePrice: "22100000", stock: 4 },
        { sku: "IPH16PM-512-BLK", storage: "512GB", color: "Black Titanium", price: "28999000", purchasePrice: "25700000", stock: 3 },
        { sku: "IPH16PM-1TB-NAT", storage: "1TB", color: "Natural Titanium", price: "32999000", purchasePrice: "29200000", stock: 2 },
      ],
    },
    {
      name: "iPhone 16 Pro",
      slug: "iphone-16-pro",
      model: "A3293",
      categorySlug: "iphone",
      description: "iPhone 16 Pro dengan layar Super Retina XDR 6.3 inci, ProMotion 120Hz, kamera telephoto 5x, dan chip A18 Pro.",
      warranty: "1 Tahun Garansi Resmi Apple / Beacukai",
      condition: "NEW",
      featured: true,
      images: [
        { url: "/images/products/iphone-16-pro-natural.png", alt: "iPhone 16 Pro Natural Titanium", isPrimary: true, sortOrder: 1 },
      ],
      variants: [
        { sku: "IPH16P-128-DST", storage: "128GB", color: "Desert Titanium", price: "20999000", purchasePrice: "18600000", stock: 4 },
        { sku: "IPH16P-256-NAT", storage: "256GB", color: "Natural Titanium", price: "22999000", purchasePrice: "20400000", stock: 5 },
        { sku: "IPH16P-256-BLK", storage: "256GB", color: "Black Titanium", price: "22999000", purchasePrice: "20400000", stock: 3 },
        { sku: "IPH16P-512-WHT", storage: "512GB", color: "White Titanium", price: "26999000", purchasePrice: "23900000", stock: 2 },
      ],
    },
    {
      name: "iPhone 16",
      slug: "iphone-16",
      model: "A3287",
      categorySlug: "iphone",
      description: "iPhone 16 dengan inovasi Camera Control, Action Button, kamera Fusion 48MP, dan chip A18 bertenaga super cepat.",
      warranty: "1 Tahun Garansi Resmi Apple / Beacukai",
      condition: "NEW",
      featured: true,
      images: [
        { url: "/images/products/iphone-16-ultramarine.png", alt: "iPhone 16 Ultramarine", isPrimary: true, sortOrder: 1 },
      ],
      variants: [
        { sku: "IPH16-128-BLK", storage: "128GB", color: "Black", price: "16499000", purchasePrice: "14500000", stock: 6 },
        { sku: "IPH16-128-BLU", storage: "128GB", color: "Ultramarine", price: "16499000", purchasePrice: "14500000", stock: 5 },
        { sku: "IPH16-256-WHT", storage: "256GB", color: "White", price: "18499000", purchasePrice: "16200000", stock: 4 },
      ],
    },
    {
      name: "iPhone 15 Pro Max",
      slug: "iphone-15-pro-max",
      model: "A3106",
      categorySlug: "iphone",
      description: "iPhone 15 Pro Max dengan desain Titanium ringan, Action Button kustom, Chip A17 Pro, dan kamera optical zoom 5x.",
      warranty: "1 Tahun Garansi Resmi iBox / GDN",
      condition: "NEW",
      featured: true,
      images: [
        { url: "/images/products/iphone-15-pro-max-natural.png", alt: "iPhone 15 Pro Max Natural Titanium", isPrimary: true, sortOrder: 1 },
      ],
      variants: [
        { sku: "IPH15PM-256-NAT", storage: "256GB", color: "Natural Titanium", price: "22499000", purchasePrice: "19900000", stock: 4 },
        { sku: "IPH15PM-256-BLK", storage: "256GB", color: "Black Titanium", price: "22499000", purchasePrice: "19900000", stock: 3 },
        { sku: "IPH15PM-512-BLU", storage: "512GB", color: "Blue Titanium", price: "26499000", purchasePrice: "23500000", stock: 2 },
      ],
    },
    {
      name: "iPhone 15 Pro",
      slug: "iphone-15-pro",
      model: "A3102",
      categorySlug: "iphone",
      description: "iPhone 15 Pro tangguh dan ringan berkat Titanium Grade 5, USB-C 3 kecepatan tinggi, dan chip gaming A17 Pro.",
      warranty: "1 Tahun Garansi Resmi iBox / GDN",
      condition: "NEW",
      featured: false,
      images: [
        { url: "/images/products/iphone-15-pro-black.png", alt: "iPhone 15 Pro Black Titanium", isPrimary: true, sortOrder: 1 },
      ],
      variants: [
        { sku: "IPH15P-128-NAT", storage: "128GB", color: "Natural Titanium", price: "18499000", purchasePrice: "16500000", stock: 4 },
        { sku: "IPH15P-256-BLK", storage: "256GB", color: "Black Titanium", price: "20499000", purchasePrice: "18200000", stock: 4 },
        { sku: "IPH15P-256-WHT", storage: "256GB", color: "White Titanium", price: "20499000", purchasePrice: "18200000", stock: 3 },
      ],
    },
    {
      name: "iPhone 15",
      slug: "iphone-15",
      model: "A3090",
      categorySlug: "iphone",
      description: "iPhone 15 dilengkapi Dynamic Island, kamera utama 48MP, port pengisian daya USB-C praktis, dan kaca belakang berinfusi warna.",
      warranty: "1 Tahun Garansi Resmi iBox / GDN",
      condition: "NEW",
      featured: false,
      images: [
        { url: "/images/products/iphone-15-black.png", alt: "iPhone 15 Black", isPrimary: true, sortOrder: 1 },
      ],
      variants: [
        { sku: "IPH15-128-BLK", storage: "128GB", color: "Black", price: "13999000", purchasePrice: "12200000", stock: 6 },
        { sku: "IPH15-128-BLU", storage: "128GB", color: "Blue", price: "13999000", purchasePrice: "12200000", stock: 5 },
        { sku: "IPH15-256-BLK", storage: "256GB", color: "Black", price: "15999000", purchasePrice: "14100000", stock: 4 },
      ],
    },
    {
      name: "Apple 20W USB-C Power Adapter",
      slug: "apple-20w-usbc-power-adapter",
      model: "MHJE3ID/A",
      categorySlug: "accessories",
      description: "Adaptor Daya USB-C Apple 20W menawarkan pengisian daya yang cepat dan efisien di rumah, di kantor, atau saat bepergian.",
      warranty: "1 Tahun Garansi Resmi Apple",
      condition: "NEW",
      featured: false,
      images: [
        { url: "/images/products/apple-20w-adapter.png", alt: "Apple 20W USB-C Power Adapter", isPrimary: true, sortOrder: 1 },
      ],
      variants: [
        { sku: "ACC-PWR-20W-WHT", storage: "Standard", color: "White", price: "449000", purchasePrice: "350000", stock: 20 },
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
      },
    });

    // Seed images
    for (const img of prodData.images) {
      const existingImg = await prisma.productImage.findFirst({
        where: { productId: product.id, url: img.url },
      });
      if (!existingImg) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: img.url,
            alt: img.alt,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder,
          },
        });
      }
    }

    // Seed variants
    for (const v of prodData.variants) {
      const variant = await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          price: v.price,
          purchasePrice: v.purchasePrice,
          storage: v.storage,
          color: v.color,
          stock: v.stock,
        },
        create: {
          productId: product.id,
          sku: v.sku,
          storage: v.storage,
          color: v.color,
          price: v.price,
          purchasePrice: v.purchasePrice,
          stock: v.stock,
        },
      });
      variantsBySku[v.sku] = variant;
    }
  }
  console.log(`   ✓ ${productsData.length} Products and ${Object.keys(variantsBySku).length} Variants seeded.`);

  // ─── 3. Suppliers ─────────────────────────────────────────────────────────────
  console.log("🏢 3. Seeding Suppliers...");
  const suppliersData = [
    {
      name: "PT Sinar Apple Mandiri",
      contactPerson: "Budi Santoso",
      whatsapp: "081122334455",
      email: "order@sinarapplemandiri.co.id",
      address: "Ruko ITC Roxy Mas Blok D2 No. 15, Gambir, Jakarta Pusat",
      notes: "Distributor utama unit iPhone segel resmi & klaim garansi cepat.",
    },
    {
      name: "CV Gadget Nusantara Jaya",
      contactPerson: "Hendra Wijaya",
      whatsapp: "081233445566",
      email: "supply@gadgetnusantara.com",
      address: "Komplek Plaza Marina Lt. 3 No. 42, Wonokromo, Surabaya",
      notes: "Supplier spesialis batch order & aksesoris Apple original.",
    },
    {
      name: "iDistribution Global ID",
      contactPerson: "Kevin Pratama",
      whatsapp: "081344556677",
      email: "kevin@idistribution.id",
      address: "Ruko Sentra Niaga Puri Indah Blok T6 No. 8, Jakarta Barat",
      notes: "Supplier unit import resmi Beacukai dan IMEI terdaftar Kemenperin.",
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

  // ─── 4. Customers ─────────────────────────────────────────────────────────────
  console.log("👥 4. Seeding Customers...");
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

  // ─── 5. Finance Categories ────────────────────────────────────────────────────
  console.log("💳 5. Seeding Finance Categories...");
  const finCategoriesData = [
    // Income
    { name: "Penjualan Unit iPhone", type: "INCOME", description: "Pendapatan dari penjualan unit iPhone" },
    { name: "Jasa Servis & Aksesoris", type: "INCOME", description: "Pendapatan jasa servis dan penjualan aksesoris" },
    { name: "Pendapatan Lain-lain", type: "INCOME", description: "Pendapatan non-operasional lainnya" },
    // Capital
    { name: "Modal Pemilik", type: "CAPITAL", description: "Injeksi modal dari pemilik atau investor" },
    // Expense
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

  // ─── 6. Purchases (Stock Purchase Orders) ─────────────────────────────────────
  console.log("📥 6. Seeding Purchases...");
  const purchase1 = await prisma.purchase.upsert({
    where: { purchaseNumber: "PO-202609-001" },
    update: {},
    create: {
      purchaseNumber: "PO-202609-001",
      supplierId: suppliers[0].id,
      purchaseDate: new Date("2026-09-10T10:00:00Z"),
      invoiceNumber: "INV-SAM-9821",
      paymentMethod: "BANK_TRANSFER",
      totalAmount: "110500000",
      status: "CONFIRMED",
      notes: "Pembelian batch pertama iPhone 16 Series dan iPhone 15 Pro Max.",
      items: {
        create: [
          { variantId: variantsBySku["IPH16PM-256-DST"].id, quantity: 2, purchasePrice: "22100000", totalPrice: "44200000" },
          { variantId: variantsBySku["IPH16P-256-NAT"].id, quantity: 2, purchasePrice: "20400000", totalPrice: "40800000" },
          { variantId: variantsBySku["IPH15PM-256-NAT"].id, quantity: 1, purchasePrice: "19900000", totalPrice: "19900000" },
          { variantId: variantsBySku["ACC-PWR-20W-WHT"].id, quantity: 16, purchasePrice: "350000", totalPrice: "5600000" },
        ],
      },
    },
  });

  const purchase2 = await prisma.purchase.upsert({
    where: { purchaseNumber: "PO-202609-002" },
    update: {},
    create: {
      purchaseNumber: "PO-202609-002",
      supplierId: suppliers[1].id,
      purchaseDate: new Date("2026-09-15T14:30:00Z"),
      invoiceNumber: "INV-GNJ-4432",
      paymentMethod: "BANK_TRANSFER",
      totalAmount: "73700000",
      status: "CONFIRMED",
      notes: "Restock iPhone 16 Reguler & iPhone 15 series Surabaya hub.",
      items: {
        create: [
          { variantId: variantsBySku["IPH16-128-BLU"].id, quantity: 2, purchasePrice: "14500000", totalPrice: "29000000" },
          { variantId: variantsBySku["IPH15P-256-BLK"].id, quantity: 1, purchasePrice: "18200000", totalPrice: "18200000" },
          { variantId: variantsBySku["IPH15-128-BLK"].id, quantity: 2, purchasePrice: "12200000", totalPrice: "24400000" },
          { variantId: variantsBySku["ACC-PWR-20W-WHT"].id, quantity: 6, purchasePrice: "350000", totalPrice: "2100000" },
        ],
      },
    },
  });
  console.log(`   ✓ Purchases PO-202609-001 & PO-202609-002 seeded.`);

  // ─── 7. Inventory Units (Physical Units with IMEI) ────────────────────────────
  console.log("🏷️  7. Seeding Physical Inventory Units (IMEI & Serial Numbers)...");
  const unitsData = [
    // iPhone 16 Pro Max
    { imei: "359871234567801", serialNumber: "F2LX98PM01", sku: "IPH16PM-256-DST", purchaseId: purchase1.id, supplierId: suppliers[0].id, purchasePrice: "22100000", sellingPrice: "24999000", batteryHealth: 100, condition: "NEW", status: "AVAILABLE" },
    { imei: "359871234567802", serialNumber: "F2LX98PM02", sku: "IPH16PM-256-DST", purchaseId: purchase1.id, supplierId: suppliers[0].id, purchasePrice: "22100000", sellingPrice: "24999000", batteryHealth: 100, condition: "NEW", status: "SOLD" },
    { imei: "359871234567803", serialNumber: "F2LX98PM03", sku: "IPH16PM-256-NAT", purchaseId: purchase1.id, supplierId: suppliers[0].id, purchasePrice: "22100000", sellingPrice: "24999000", batteryHealth: 100, condition: "NEW", status: "AVAILABLE" },
    { imei: "359871234567804", serialNumber: "F2LX98PM04", sku: "IPH16PM-512-BLK", purchaseId: purchase1.id, supplierId: suppliers[0].id, purchasePrice: "25700000", sellingPrice: "28999000", batteryHealth: 100, condition: "NEW", status: "RESERVED" },
    
    // iPhone 16 Pro
    { imei: "359871234567805", serialNumber: "F2LX98P005", sku: "IPH16P-256-NAT", purchaseId: purchase1.id, supplierId: suppliers[0].id, purchasePrice: "20400000", sellingPrice: "22999000", batteryHealth: 100, condition: "NEW", status: "AVAILABLE" },
    { imei: "359871234567806", serialNumber: "F2LX98P006", sku: "IPH16P-256-NAT", purchaseId: purchase1.id, supplierId: suppliers[0].id, purchasePrice: "20400000", sellingPrice: "22999000", batteryHealth: 100, condition: "NEW", status: "SOLD" },
    { imei: "359871234567807", serialNumber: "F2LX98P007", sku: "IPH16P-128-DST", purchaseId: purchase1.id, supplierId: suppliers[0].id, purchasePrice: "18600000", sellingPrice: "20999000", batteryHealth: 100, condition: "NEW", status: "AVAILABLE" },
    
    // iPhone 16
    { imei: "359871234567808", serialNumber: "F2LX981608", sku: "IPH16-128-BLU", purchaseId: purchase2.id, supplierId: suppliers[1].id, purchasePrice: "14500000", sellingPrice: "16499000", batteryHealth: 100, condition: "NEW", status: "AVAILABLE" },
    { imei: "359871234567809", serialNumber: "F2LX981609", sku: "IPH16-128-BLU", purchaseId: purchase2.id, supplierId: suppliers[1].id, purchasePrice: "14500000", sellingPrice: "16499000", batteryHealth: 100, condition: "NEW", status: "AVAILABLE" },
    { imei: "359871234567810", serialNumber: "F2LX981610", sku: "IPH16-128-BLK", purchaseId: purchase2.id, supplierId: suppliers[1].id, purchasePrice: "14500000", sellingPrice: "16499000", batteryHealth: 100, condition: "NEW", status: "AVAILABLE" },
    
    // iPhone 15 Pro Max
    { imei: "359871234567811", serialNumber: "F2LX985M11", sku: "IPH15PM-256-NAT", purchaseId: purchase1.id, supplierId: suppliers[0].id, purchasePrice: "19900000", sellingPrice: "22499000", batteryHealth: 100, condition: "NEW", status: "SOLD" },
    { imei: "359871234567812", serialNumber: "F2LX985M12", sku: "IPH15PM-256-BLK", purchaseId: purchase1.id, supplierId: suppliers[0].id, purchasePrice: "19900000", sellingPrice: "22499000", batteryHealth: 99, condition: "LIKE_NEW", status: "AVAILABLE" },
    
    // iPhone 15 Pro
    { imei: "359871234567813", serialNumber: "F2LX985P13", sku: "IPH15P-256-BLK", purchaseId: purchase2.id, supplierId: suppliers[1].id, purchasePrice: "18200000", sellingPrice: "20499000", batteryHealth: 100, condition: "NEW", status: "AVAILABLE" },
    
    // iPhone 15
    { imei: "359871234567814", serialNumber: "F2LX981514", sku: "IPH15-128-BLK", purchaseId: purchase2.id, supplierId: suppliers[1].id, purchasePrice: "12200000", sellingPrice: "13999000", batteryHealth: 100, condition: "NEW", status: "AVAILABLE" },
    { imei: "359871234567815", serialNumber: "F2LX981515", sku: "IPH15-128-BLK", purchaseId: purchase2.id, supplierId: suppliers[1].id, purchasePrice: "12200000", sellingPrice: "13999000", batteryHealth: 98, condition: "LIKE_NEW", status: "AVAILABLE" },
  ];

  const inventoryUnitsByImei = {};
  for (const u of unitsData) {
    const variant = variantsBySku[u.sku];
    const unit = await prisma.inventoryUnit.upsert({
      where: { imei: u.imei },
      update: {
        serialNumber: u.serialNumber,
        variantId: variant.id,
        purchasePrice: u.purchasePrice,
        sellingPrice: u.sellingPrice,
        batteryHealth: u.batteryHealth,
        condition: u.condition,
        status: u.status,
        purchaseId: u.purchaseId,
        supplierId: u.supplierId,
      },
      create: {
        imei: u.imei,
        serialNumber: u.serialNumber,
        variantId: variant.id,
        purchasePrice: u.purchasePrice,
        sellingPrice: u.sellingPrice,
        batteryHealth: u.batteryHealth,
        condition: u.condition,
        status: u.status,
        purchaseId: u.purchaseId,
        supplierId: u.supplierId,
      },
    });
    inventoryUnitsByImei[u.imei] = unit;
  }
  console.log(`   ✓ ${Object.keys(inventoryUnitsByImei).length} Physical Inventory Units seeded.`);

  // ─── 8. Orders ────────────────────────────────────────────────────────────────
  console.log("🛒 8. Seeding Customer Orders & Order Items...");

  // Order 1: COMPLETED (iPhone 16 Pro Max 256GB Desert + 20W Adapter)
  const order1 = await prisma.order.upsert({
    where: { orderNumber: "ORD-202609-001" },
    update: {},
    create: {
      orderNumber: "ORD-202609-001",
      customerId: customers[0].id,
      status: "COMPLETED",
      subtotal: "25448000",
      shippingCost: "50000",
      discount: "0",
      total: "25498000",
      deliveryMethod: "DELIVERY",
      address: customers[0].address,
      notes: "Sertakan invoice fisik dan kartu garansi resmi.",
      completedAt: new Date("2026-09-18T16:00:00Z"),
      createdAt: new Date("2026-09-18T11:00:00Z"),
      items: {
        create: [
          {
            variantId: variantsBySku["IPH16PM-256-DST"].id,
            inventoryUnitId: inventoryUnitsByImei["359871234567802"].id,
            productNameSnapshot: "iPhone 16 Pro Max",
            variantSnapshot: "256GB - Desert Titanium",
            quantity: 1,
            sellingPrice: "24999000",
            purchaseCost: "22100000",
            total: "24999000",
          },
          {
            variantId: variantsBySku["ACC-PWR-20W-WHT"].id,
            productNameSnapshot: "Apple 20W USB-C Power Adapter",
            variantSnapshot: "Standard - White",
            quantity: 1,
            sellingPrice: "449000",
            purchaseCost: "350000",
            total: "449000",
          },
        ],
      },
    },
  });

  // Link sold unit 359871234567802 to Order 1
  await prisma.inventoryUnit.update({
    where: { imei: "359871234567802" },
    data: { soldOrderId: order1.id, status: "SOLD", soldAt: new Date("2026-09-18T16:00:00Z") },
  });

  // Order 2: SHIPPED (iPhone 16 Pro 256GB Natural)
  const order2 = await prisma.order.upsert({
    where: { orderNumber: "ORD-202609-002" },
    update: {},
    create: {
      orderNumber: "ORD-202609-002",
      customerId: customers[1].id,
      status: "SHIPPED",
      subtotal: "22999000",
      shippingCost: "75000",
      discount: "0",
      total: "23074000",
      deliveryMethod: "DELIVERY",
      address: customers[1].address,
      notes: "No Resi JNE YES: JNE8821903421",
      createdAt: new Date("2026-09-22T09:30:00Z"),
      items: {
        create: [
          {
            variantId: variantsBySku["IPH16P-256-NAT"].id,
            inventoryUnitId: inventoryUnitsByImei["359871234567806"].id,
            productNameSnapshot: "iPhone 16 Pro",
            variantSnapshot: "256GB - Natural Titanium",
            quantity: 1,
            sellingPrice: "22999000",
            purchaseCost: "20400000",
            total: "22999000",
          },
        ],
      },
    },
  });

  await prisma.inventoryUnit.update({
    where: { imei: "359871234567806" },
    data: { soldOrderId: order2.id, status: "SOLD", soldAt: new Date("2026-09-22T10:00:00Z") },
  });

  // Order 3: PROCESSING (iPhone 15 Pro Max 256GB Natural)
  const order3 = await prisma.order.upsert({
    where: { orderNumber: "ORD-202609-003" },
    update: {},
    create: {
      orderNumber: "ORD-202609-003",
      customerId: customers[2].id,
      status: "PROCESSING",
      subtotal: "22499000",
      shippingCost: "0",
      discount: "0",
      total: "22499000",
      deliveryMethod: "PICKUP",
      notes: "Customer akan ambil langsung di store cabang Surabaya.",
      createdAt: new Date("2026-09-24T14:15:00Z"),
      items: {
        create: [
          {
            variantId: variantsBySku["IPH15PM-256-NAT"].id,
            inventoryUnitId: inventoryUnitsByImei["359871234567811"].id,
            productNameSnapshot: "iPhone 15 Pro Max",
            variantSnapshot: "256GB - Natural Titanium",
            quantity: 1,
            sellingPrice: "22499000",
            purchaseCost: "19900000",
            total: "22499000",
          },
        ],
      },
    },
  });

  await prisma.inventoryUnit.update({
    where: { imei: "359871234567811" },
    data: { soldOrderId: order3.id, status: "SOLD", soldAt: new Date("2026-09-24T14:30:00Z") },
  });

  // Order 4: CONFIRMED / RESERVED (iPhone 16 Pro Max 512GB Black)
  const order4 = await prisma.order.upsert({
    where: { orderNumber: "ORD-202609-004" },
    update: {},
    create: {
      orderNumber: "ORD-202609-004",
      customerId: customers[3].id,
      status: "CONFIRMED",
      subtotal: "28999000",
      shippingCost: "60000",
      discount: "0",
      total: "29059000",
      deliveryMethod: "DELIVERY",
      address: customers[3].address,
      notes: "Menunggu pembayaran lunas via Transfer BCA.",
      createdAt: new Date("2026-09-26T08:20:00Z"),
      items: {
        create: [
          {
            variantId: variantsBySku["IPH16PM-512-BLK"].id,
            inventoryUnitId: inventoryUnitsByImei["359871234567804"].id,
            productNameSnapshot: "iPhone 16 Pro Max",
            variantSnapshot: "512GB - Black Titanium",
            quantity: 1,
            sellingPrice: "28999000",
            purchaseCost: "25700000",
            total: "28999000",
          },
        ],
      },
    },
  });

  // Order 5: PENDING (iPhone 16 128GB Ultramarine)
  await prisma.order.upsert({
    where: { orderNumber: "ORD-202609-005" },
    update: {},
    create: {
      orderNumber: "ORD-202609-005",
      customerId: customers[4].id,
      status: "PENDING",
      subtotal: "16499000",
      shippingCost: "55000",
      discount: "0",
      total: "16554000",
      deliveryMethod: "DELIVERY",
      address: customers[4].address,
      notes: "Checkout baru melalui website, menunggu konfirmasi WhatsApp admin.",
      createdAt: new Date("2026-09-27T15:00:00Z"),
      items: {
        create: [
          {
            variantId: variantsBySku["IPH16-128-BLU"].id,
            productNameSnapshot: "iPhone 16",
            variantSnapshot: "128GB - Ultramarine",
            quantity: 1,
            sellingPrice: "16499000",
            purchaseCost: "14500000",
            total: "16499000",
          },
        ],
      },
    },
  });
  console.log(`   ✓ 5 Orders (COMPLETED, SHIPPED, PROCESSING, CONFIRMED, PENDING) seeded.`);

  // ─── 9. Finance Transactions ──────────────────────────────────────────────────
  console.log("💰 9. Seeding Finance Transactions (Inflow, Outflow, Capital)...");
  const transactionsData = [
    // 1. Initial Capital Injection
    {
      categoryId: finCategories["Modal Pemilik"].id,
      type: "CAPITAL",
      amount: "250000000",
      date: new Date("2026-09-01T08:00:00Z"),
      paymentMethod: "BANK_TRANSFER",
      reference: "CAP-2026-001",
      description: "Setoran modal awal usaha Gamen Store dari Founder & Investor.",
    },
    // 2. PO 1 Outflow
    {
      categoryId: finCategories["Pembelian Stok iPhone"].id,
      type: "EXPENSE",
      amount: "110500000",
      date: new Date("2026-09-10T11:00:00Z"),
      paymentMethod: "BANK_TRANSFER",
      reference: "PO-202609-001",
      description: "Pembayaran kulakan stok iPhone 16 Series ke PT Sinar Apple Mandiri.",
      purchaseId: purchase1.id,
    },
    // 3. PO 2 Outflow
    {
      categoryId: finCategories["Pembelian Stok iPhone"].id,
      type: "EXPENSE",
      amount: "73700000",
      date: new Date("2026-09-15T15:00:00Z"),
      paymentMethod: "BANK_TRANSFER",
      reference: "PO-202609-002",
      description: "Pembayaran kulakan stok iPhone 15 & 16 series ke CV Gadget Nusantara Jaya.",
      purchaseId: purchase2.id,
    },
    // 4. Order 1 Revenue Inflow
    {
      categoryId: finCategories["Penjualan Unit iPhone"].id,
      type: "INCOME",
      amount: "25498000",
      date: new Date("2026-09-18T16:00:00Z"),
      paymentMethod: "BANK_TRANSFER",
      reference: "ORD-202609-001",
      description: "Penerimaan pembayaran lunas Order ORD-202609-001 (iPhone 16 Pro Max + Adapter).",
      orderId: order1.id,
    },
    // 5. Order 2 Revenue Inflow
    {
      categoryId: finCategories["Penjualan Unit iPhone"].id,
      type: "INCOME",
      amount: "23074000",
      date: new Date("2026-09-22T09:45:00Z"),
      paymentMethod: "BANK_TRANSFER",
      reference: "ORD-202609-002",
      description: "Penerimaan pembayaran lunas Order ORD-202609-002 (iPhone 16 Pro 256GB Natural).",
      orderId: order2.id,
    },
    // 6. Operational: Sewa Toko / Ruko
    {
      categoryId: finCategories["Sewa Tempat"].id,
      type: "EXPENSE",
      amount: "15000000",
      date: new Date("2026-09-05T10:00:00Z"),
      paymentMethod: "BANK_TRANSFER",
      reference: "EXP-RENT-0926",
      description: "Pembayaran sewa ruko operasional & display showroom bulan September 2026.",
    },
    // 7. Operational: Iklan Meta / Google Ads
    {
      categoryId: finCategories["Pemasaran & Iklan"].id,
      type: "EXPENSE",
      amount: "3500000",
      date: new Date("2026-09-12T13:00:00Z"),
      paymentMethod: "E_WALLET",
      reference: "EXP-ADS-0926",
      description: "Biaya kampanye iklan Instagram & TikTok Ads peluncuran iPhone 16.",
    },
    // 8. Operational: Listrik & Internet
    {
      categoryId: finCategories["Listrik & Internet"].id,
      type: "EXPENSE",
      amount: "1250000",
      date: new Date("2026-09-20T09:00:00Z"),
      paymentMethod: "BANK_TRANSFER",
      reference: "EXP-UTIL-0926",
      description: "Tagihan listrik PLN dan internet IndiBiz kecepatan tinggi untuk store.",
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

  console.log("\n🎉 Database seeding completed successfully with full relational integrity!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
