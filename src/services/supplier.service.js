import { prisma } from "@/lib/prisma";

/**
 * Get paginated suppliers with aggregate stats.
 */
export async function getSuppliers({ page = 1, limit = 20, search, active } = {}) {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where = {};

  if (active !== undefined && active !== "ALL") {
    where.active = active === "true" || active === true;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { contactPerson: { contains: search, mode: "insensitive" } },
      { whatsapp: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        purchases: {
          select: {
            id: true,
            totalAmount: true,
            purchaseDate: true,
            status: true,
            items: {
              select: { quantity: true },
            },
          },
        },
      },
    }),
    prisma.supplier.count({ where }),
  ]);

  // Map aggregate metrics
  const mappedSuppliers = suppliers.map((sup) => {
    const confirmedPurchases = sup.purchases.filter((p) => p.status === "CONFIRMED");
    const totalSpending = confirmedPurchases.reduce((sum, p) => sum + Number(p.totalAmount), 0);
    const totalUnits = confirmedPurchases.reduce(
      (sum, p) => sum + p.items.reduce((iSum, i) => iSum + i.quantity, 0),
      0
    );
    const lastPurchase = sup.purchases.length > 0 ? sup.purchases[0].purchaseDate : null;

    return {
      ...sup,
      totalPurchases: sup.purchases.length,
      confirmedPurchasesCount: confirmedPurchases.length,
      totalSpending,
      totalUnits,
      lastPurchase,
    };
  });

  return {
    suppliers: mappedSuppliers,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get supplier by ID with full purchase history.
 */
export async function getSupplierById(id) {
  if (!id) return null;

  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      purchases: {
        orderBy: { purchaseDate: "desc" },
        include: {
          items: {
            include: {
              variant: {
                include: { product: true },
              },
            },
          },
        },
      },
      inventoryUnits: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  });

  if (!supplier) return null;

  const confirmedPurchases = supplier.purchases.filter((p) => p.status === "CONFIRMED");
  const totalSpending = confirmedPurchases.reduce((sum, p) => sum + Number(p.totalAmount), 0);
  const totalUnits = confirmedPurchases.reduce(
    (sum, p) => sum + p.items.reduce((iSum, i) => iSum + i.quantity, 0),
    0
  );

  return {
    ...supplier,
    totalSpending,
    totalUnits,
  };
}

/**
 * Create a new supplier.
 */
export async function createSupplier(data) {
  if (!data.name?.trim()) {
    throw new Error("Nama supplier wajib diisi.");
  }

  return prisma.supplier.create({
    data: {
      name: data.name.trim(),
      contactPerson: data.contactPerson?.trim() || null,
      whatsapp: data.whatsapp?.trim() || null,
      email: data.email?.trim() || null,
      address: data.address?.trim() || null,
      notes: data.notes?.trim() || null,
      active: data.active !== undefined ? data.active : true,
    },
  });
}

/**
 * Update an existing supplier.
 */
export async function updateSupplier(id, data) {
  return prisma.supplier.update({
    where: { id },
    data: {
      name: data.name?.trim(),
      contactPerson: data.contactPerson !== undefined ? data.contactPerson?.trim() || null : undefined,
      whatsapp: data.whatsapp !== undefined ? data.whatsapp?.trim() || null : undefined,
      email: data.email !== undefined ? data.email?.trim() || null : undefined,
      address: data.address !== undefined ? data.address?.trim() || null : undefined,
      notes: data.notes !== undefined ? data.notes?.trim() || null : undefined,
      active: data.active !== undefined ? data.active : undefined,
    },
  });
}

/**
 * Soft toggle supplier active state (protects against hard delete if purchases exist).
 */
export async function toggleSupplierActive(id) {
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier) throw new Error("Supplier tidak ditemukan.");

  return prisma.supplier.update({
    where: { id },
    data: { active: !supplier.active },
  });
}
