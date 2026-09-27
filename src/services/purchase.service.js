import { prisma } from "@/lib/prisma";

/**
 * Generate formatted purchase number: PO-YYYYMMDD-XXXX
 */
export async function generatePurchaseNumber(tx = prisma) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const prefix = `PO-${year}${month}${day}`;

  const countToday = await tx.purchase.count({
    where: { purchaseNumber: { startsWith: prefix } },
  });

  const sequence = String(countToday + 1).padStart(4, "0");
  let purchaseNumber = `${prefix}-${sequence}`;

  let exists = await tx.purchase.findUnique({ where: { purchaseNumber } });
  let counter = countToday + 1;
  while (exists) {
    counter++;
    purchaseNumber = `${prefix}-${String(counter).padStart(4, "0")}`;
    exists = await tx.purchase.findUnique({ where: { purchaseNumber } });
  }

  return purchaseNumber;
}

/**
 * Get paginated purchases.
 */
export async function getPurchases({
  page = 1,
  limit = 20,
  status,
  supplierId,
  search,
} = {}) {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where = {};

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (supplierId) {
    where.supplierId = supplierId;
  }

  if (search) {
    where.OR = [
      { purchaseNumber: { contains: search, mode: "insensitive" } },
      { invoiceNumber: { contains: search, mode: "insensitive" } },
      { supplier: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [purchases, total] = await Promise.all([
    prisma.purchase.findMany({
      where,
      skip,
      take,
      orderBy: { purchaseDate: "desc" },
      include: {
        supplier: true,
        items: {
          include: {
            variant: {
              include: { product: true },
            },
          },
        },
      },
    }),
    prisma.purchase.count({ where }),
  ]);

  return {
    purchases,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get single purchase by ID.
 */
export async function getPurchaseById(id) {
  if (!id) return null;
  return prisma.purchase.findUnique({
    where: { id },
    include: {
      supplier: true,
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
      inventoryUnits: true,
      transactions: true,
    },
  });
}

/**
 * Create a new Purchase Order (DRAFT or CONFIRMED).
 */
export async function createPurchase({
  supplierId,
  purchaseDate,
  invoiceNumber,
  paymentMethod = "BANK_TRANSFER",
  notes,
  items = [],
  status = "DRAFT",
}) {
  if (!supplierId || !items.length) {
    throw new Error("Supplier dan minimal satu item pembelian wajib diisi.");
  }

  return await prisma.$transaction(async (tx) => {
    const purchaseNumber = await generatePurchaseNumber(tx);

    let calculatedTotal = 0;
    const preparedItems = [];

    for (const item of items) {
      if (!item.variantId || !item.quantity || item.purchasePrice === undefined) {
        throw new Error("Setiap item harus memiliki varian, quantity, dan harga beli.");
      }

      const itemTotal = Number(item.purchasePrice) * Number(item.quantity);
      calculatedTotal += itemTotal;

      preparedItems.push({
        variantId: item.variantId,
        quantity: Number(item.quantity),
        purchasePrice: Number(item.purchasePrice),
        totalPrice: itemTotal,
        imei: item.imei?.trim() || null,
        serialNumber: item.serialNumber?.trim() || null,
      });
    }

    const purchase = await tx.purchase.create({
      data: {
        purchaseNumber,
        supplierId,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
        invoiceNumber: invoiceNumber?.trim() || null,
        paymentMethod,
        totalAmount: calculatedTotal,
        status: "DRAFT",
        notes: notes?.trim() || null,
        items: {
          create: preparedItems,
        },
      },
      include: {
        supplier: true,
        items: true,
      },
    });

    // If requested to create directly as CONFIRMED, confirm it
    if (status === "CONFIRMED") {
      return await confirmPurchaseInternal(purchase.id, tx);
    }

    return purchase;
  });
}

/**
 * Internal helper to confirm purchase and generate inventory & finance transactions.
 */
async function confirmPurchaseInternal(purchaseId, tx) {
  const purchase = await tx.purchase.findUnique({
    where: { id: purchaseId },
    include: {
      supplier: true,
      items: {
        include: { variant: true },
      },
      inventoryUnits: true,
      transactions: true,
    },
  });

  if (!purchase) throw new Error("Pembelian tidak ditemukan.");
  if (purchase.status === "CONFIRMED") return purchase; // Idempotent

  // 1. Create Inventory Units & increment stock
  for (const item of purchase.items) {
    // Generate individual units if IMEI provided or auto-generate placeholder IMEI
    for (let i = 0; i < item.quantity; i++) {
      let unitImei = item.imei;
      if (!unitImei || item.quantity > 1) {
        // Generate unique inventory code if multiple units
        const timestamp = Date.now().toString().slice(-6);
        unitImei = `${item.variant.sku}-PO${purchase.id.slice(-4)}-${i + 1}-${timestamp}`;
      }

      // Check unique
      const existingImei = await tx.inventoryUnit.findUnique({ where: { imei: unitImei } });
      if (!existingImei) {
        await tx.inventoryUnit.create({
          data: {
            variantId: item.variantId,
            imei: unitImei,
            serialNumber: item.serialNumber || null,
            purchasePrice: item.purchasePrice,
            status: "AVAILABLE",
            condition: "NEW",
            supplierId: purchase.supplierId,
            purchaseId: purchase.id,
            receivedAt: purchase.purchaseDate || new Date(),
          },
        });
      }
    }

    // Increment variant stock
    await tx.productVariant.update({
      where: { id: item.variantId },
      data: {
        stock: { increment: item.quantity },
      },
    });
  }

  // 2. Create Finance Expense Transaction
  let expenseCategory = await tx.financeCategory.findFirst({
    where: { type: "EXPENSE", name: { contains: "Pembelian Stok" } },
  });

  if (!expenseCategory) {
    expenseCategory = await tx.financeCategory.create({
      data: {
        name: "Pembelian Stok iPhone",
        type: "EXPENSE",
        description: "Pengeluaran belanja modal kulakan unit dan stok produk",
      },
    });
  }

  const existingTx = await tx.financeTransaction.findFirst({
    where: { purchaseId: purchase.id, type: "EXPENSE" },
  });

  if (!existingTx) {
    await tx.financeTransaction.create({
      data: {
        categoryId: expenseCategory.id,
        type: "EXPENSE",
        amount: purchase.totalAmount,
        date: purchase.purchaseDate || new Date(),
        paymentMethod: purchase.paymentMethod,
        reference: purchase.purchaseNumber,
        description: `Pembelian stok ${purchase.purchaseNumber} dari ${purchase.supplier.name}`,
        purchaseId: purchase.id,
      },
    });
  }

  // 3. Mark Purchase CONFIRMED
  const updatedPurchase = await tx.purchase.update({
    where: { id: purchaseId },
    data: { status: "CONFIRMED" },
    include: {
      supplier: true,
      items: true,
      inventoryUnits: true,
      transactions: true,
    },
  });

  return updatedPurchase;
}

/**
 * Public Confirm Purchase wrapper.
 */
export async function confirmPurchase(purchaseId) {
  return await prisma.$transaction(async (tx) => {
    return await confirmPurchaseInternal(purchaseId, tx);
  });
}
