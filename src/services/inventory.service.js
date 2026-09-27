import { prisma } from "@/lib/prisma";

/**
 * Get paginated inventory units with rich filters.
 */
export async function getInventoryUnits({
  page = 1,
  limit = 20,
  status,
  variantId,
  productId,
  condition,
  search,
} = {}) {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where = {};

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (condition && condition !== "ALL") {
    where.condition = condition;
  }

  if (variantId) {
    where.variantId = variantId;
  }

  if (productId) {
    where.variant = { productId };
  }

  if (search) {
    where.OR = [
      { imei: { contains: search, mode: "insensitive" } },
      { serialNumber: { contains: search, mode: "insensitive" } },
      { variant: { sku: { contains: search, mode: "insensitive" } } },
      { variant: { product: { name: { contains: search, mode: "insensitive" } } } },
    ];
  }

  const [units, total] = await Promise.all([
    prisma.inventoryUnit.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
        supplier: true,
        purchase: true,
      },
    }),
    prisma.inventoryUnit.count({ where }),
  ]);

  return {
    units,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get inventory unit by ID.
 */
export async function getInventoryUnitById(id) {
  if (!id) return null;
  return prisma.inventoryUnit.findUnique({
    where: { id },
    include: {
      variant: {
        include: {
          product: true,
        },
      },
      supplier: true,
      purchase: true,
      soldOrder: {
        include: {
          customer: true,
        },
      },
    },
  });
}

/**
 * Create a new inventory unit manually or via stock adjustment.
 * Validates unique IMEI.
 */
export async function createInventoryUnit(data) {
  if (!data.imei || !data.variantId || data.purchasePrice === undefined) {
    throw new Error("IMEI, Varian Produk, dan Harga Beli wajib diisi.");
  }

  const cleanImei = data.imei.trim();

  // Check unique IMEI
  const existing = await prisma.inventoryUnit.findUnique({
    where: { imei: cleanImei },
  });

  if (existing) {
    throw new Error(`IMEI ${cleanImei} sudah terdaftar dalam sistem.`);
  }

  return await prisma.$transaction(async (tx) => {
    const unit = await tx.inventoryUnit.create({
      data: {
        variantId: data.variantId,
        imei: cleanImei,
        serialNumber: data.serialNumber?.trim() || null,
        purchasePrice: Number(data.purchasePrice),
        sellingPrice: data.sellingPrice ? Number(data.sellingPrice) : null,
        batteryHealth: data.batteryHealth ? Number(data.batteryHealth) : null,
        condition: data.condition || "GOOD",
        status: data.status || "AVAILABLE",
        supplierId: data.supplierId || null,
        notes: data.notes?.trim() || null,
      },
      include: {
        variant: { include: { product: true } },
      },
    });

    // If unit is AVAILABLE, increase variant stock
    if (unit.status === "AVAILABLE") {
      await tx.productVariant.update({
        where: { id: data.variantId },
        data: { stock: { increment: 1 } },
      });
    }

    return unit;
  });
}

/**
 * Update inventory unit data (condition, battery health, selling price, notes, status).
 */
export async function updateInventoryUnit(id, data) {
  const existing = await prisma.inventoryUnit.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Unit inventaris tidak ditemukan.");
  }

  if (existing.status === "SOLD" && data.status && data.status !== "SOLD") {
    throw new Error("Unit yang sudah berstatus SOLD tidak dapat diubah kembali ke status lain tanpa prosedur retur resmi.");
  }

  return await prisma.$transaction(async (tx) => {
    const oldStatus = existing.status;
    const newStatus = data.status || oldStatus;

    // Handle stock count adjustments if status changes between AVAILABLE / RESERVED / DAMAGED
    if (oldStatus !== newStatus) {
      if (oldStatus === "AVAILABLE" && newStatus !== "AVAILABLE") {
        await tx.productVariant.update({
          where: { id: existing.variantId },
          data: { stock: { decrement: 1 } },
        });
      } else if (oldStatus !== "AVAILABLE" && newStatus === "AVAILABLE") {
        await tx.productVariant.update({
          where: { id: existing.variantId },
          data: { stock: { increment: 1 } },
        });
      }
    }

    const updated = await tx.inventoryUnit.update({
      where: { id },
      data: {
        serialNumber: data.serialNumber !== undefined ? data.serialNumber?.trim() || null : existing.serialNumber,
        batteryHealth: data.batteryHealth !== undefined ? (data.batteryHealth ? Number(data.batteryHealth) : null) : existing.batteryHealth,
        condition: data.condition || existing.condition,
        sellingPrice: data.sellingPrice !== undefined ? (data.sellingPrice ? Number(data.sellingPrice) : null) : existing.sellingPrice,
        status: newStatus,
        notes: data.notes !== undefined ? data.notes?.trim() || null : existing.notes,
      },
      include: {
        variant: { include: { product: true } },
      },
    });

    return updated;
  });
}

/**
 * Get inventory aggregated statistics.
 */
export async function getInventoryStats() {
  const [totalUnits, availableUnits, reservedUnits, soldUnits, damagedUnits] = await Promise.all([
    prisma.inventoryUnit.count(),
    prisma.inventoryUnit.count({ where: { status: "AVAILABLE" } }),
    prisma.inventoryUnit.count({ where: { status: "RESERVED" } }),
    prisma.inventoryUnit.count({ where: { status: "SOLD" } }),
    prisma.inventoryUnit.count({ where: { status: "DAMAGED" } }),
  ]);

  // Total inventory value based on purchase cost of AVAILABLE + RESERVED units
  const activeUnits = await prisma.inventoryUnit.findMany({
    where: { status: { in: ["AVAILABLE", "RESERVED"] } },
    select: { purchasePrice: true },
  });

  const inventoryValue = activeUnits.reduce((sum, u) => sum + Number(u.purchasePrice), 0);

  return {
    totalUnits,
    availableUnits,
    reservedUnits,
    soldUnits,
    damagedUnits,
    inventoryValue,
  };
}
