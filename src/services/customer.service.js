import { prisma } from "@/lib/prisma";

/**
 * Get paginated customers with order spending aggregates.
 */
export async function getCustomers({ page = 1, limit = 20, search } = {}) {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { whatsapp: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  const mapped = customers.map((c) => {
    const completedOrders = c.orders.filter((o) => o.status === "COMPLETED");
    const totalSpending = completedOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const lastOrder = c.orders.length > 0 ? c.orders[0].createdAt : null;

    return {
      ...c,
      totalOrders: c.orders.length,
      completedOrdersCount: completedOrders.length,
      totalSpending,
      lastOrder,
    };
  });

  return {
    customers: mapped,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get customer by ID with full order history.
 */
export async function getCustomerById(id) {
  if (!id) return null;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
        },
      },
    },
  });

  if (!customer) return null;

  const completedOrders = customer.orders.filter((o) => o.status === "COMPLETED");
  const totalSpending = completedOrders.reduce((sum, o) => sum + Number(o.total), 0);

  return {
    ...customer,
    totalSpending,
    completedOrdersCount: completedOrders.length,
  };
}

/**
 * Update customer information.
 */
export async function updateCustomer(id, data) {
  return prisma.customer.update({
    where: { id },
    data: {
      name: data.name?.trim(),
      email: data.email !== undefined ? data.email?.trim() || null : undefined,
      whatsapp: data.whatsapp?.trim(),
      province: data.province !== undefined ? data.province?.trim() || null : undefined,
      city: data.city !== undefined ? data.city?.trim() || null : undefined,
      district: data.district !== undefined ? data.district?.trim() || null : undefined,
      postalCode: data.postalCode !== undefined ? data.postalCode?.trim() || null : undefined,
      address: data.address !== undefined ? data.address?.trim() || null : undefined,
      notes: data.notes !== undefined ? data.notes?.trim() || null : undefined,
    },
  });
}
