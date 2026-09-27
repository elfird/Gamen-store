import { prisma } from "@/lib/prisma";

/**
 * Get overall finance overview & true accounting profit metrics.
 */
export async function getFinanceOverview({ dateFrom, dateTo } = {}) {
  const where = {};
  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      where.date.lte = end;
    }
  }

  // 1. Fetch all financial transactions
  const transactions = await prisma.financeTransaction.findMany({
    where,
    include: {
      category: true,
      order: true,
      purchase: true,
    },
    orderBy: { date: "desc" },
  });

  // Calculate Cash Flows
  let totalCashIn = 0; // All INCOME + CAPITAL
  let totalCashOut = 0; // All EXPENSE
  let salesRevenue = 0; // Only Sales Income
  let capitalInflow = 0; // Only Capital Injection
  let inventoryPurchasesOutflow = 0; // Inventory Purchase expenses
  let operationalExpenses = 0; // Other operational expenses

  for (const t of transactions) {
    const amt = Number(t.amount);
    if (t.type === "INCOME") {
      totalCashIn += amt;
      salesRevenue += amt;
    } else if (t.type === "CAPITAL") {
      totalCashIn += amt;
      capitalInflow += amt;
    } else if (t.type === "EXPENSE") {
      totalCashOut += amt;
      if (t.category.name.toLowerCase().includes("pembelian stok") || t.category.name.toLowerCase().includes("inventory")) {
        inventoryPurchasesOutflow += amt;
      } else {
        operationalExpenses += amt;
      }
    }
  }

  const netCashFlow = totalCashIn - totalCashOut;

  // 2. Calculate COGS for all COMPLETED orders in the period
  const orderWhere = { status: "COMPLETED" };
  if (dateFrom || dateTo) {
    orderWhere.createdAt = {};
    if (dateFrom) orderWhere.createdAt.gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      orderWhere.createdAt.lte = end;
    }
  }

  const completedOrders = await prisma.order.findMany({
    where: orderWhere,
    include: {
      items: {
        include: {
          inventoryUnit: true,
          variant: true,
        },
      },
    },
  });

  let totalCogs = 0;
  let totalOrderRevenue = 0;

  for (const order of completedOrders) {
    totalOrderRevenue += Number(order.total);
    for (const item of order.items) {
      if (item.inventoryUnit && item.inventoryUnit.purchasePrice) {
        totalCogs += Number(item.inventoryUnit.purchasePrice) * item.quantity;
      } else if (Number(item.purchaseCost) > 0) {
        totalCogs += Number(item.purchaseCost) * item.quantity;
      } else if (item.variant && item.variant.purchasePrice) {
        totalCogs += Number(item.variant.purchasePrice) * item.quantity;
      }
    }
  }

  // Authoritative Revenue is the Sales Revenue
  const revenue = salesRevenue || totalOrderRevenue;
  const grossProfit = revenue - totalCogs;
  const netProfit = grossProfit - operationalExpenses;

  return {
    revenue,
    salesRevenue,
    capitalInflow,
    totalCashIn,
    totalCashOut,
    netCashFlow,
    inventoryPurchasesOutflow,
    operationalExpenses,
    totalCogs,
    grossProfit,
    netProfit,
    grossProfitMargin: revenue > 0 ? (grossProfit / revenue) * 100 : 0,
    netProfitMargin: revenue > 0 ? (netProfit / revenue) * 100 : 0,
    transactionCount: transactions.length,
    recentTransactions: transactions.slice(0, 10),
  };
}

/**
 * Get paginated transactions with category & type filtering.
 */
export async function getFinanceTransactions({
  page = 1,
  limit = 20,
  type,
  categoryId,
  search,
  dateFrom,
  dateTo,
} = {}) {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where = {};

  if (type && type !== "ALL") {
    where.type = type;
  }

  if (categoryId && categoryId !== "ALL") {
    where.categoryId = categoryId;
  }

  if (search) {
    where.OR = [
      { description: { contains: search, mode: "insensitive" } },
      { reference: { contains: search, mode: "insensitive" } },
      { category: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      where.date.lte = end;
    }
  }

  const [transactions, total] = await Promise.all([
    prisma.financeTransaction.findMany({
      where,
      skip,
      take,
      orderBy: { date: "desc" },
      include: {
        category: true,
        order: { select: { id: true, orderNumber: true } },
        purchase: { select: { id: true, purchaseNumber: true } },
      },
    }),
    prisma.financeTransaction.count({ where }),
  ]);

  return {
    transactions,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Create a manual financial transaction (Income, Expense, Capital).
 */
export async function createFinanceTransaction(data) {
  if (!data.categoryId || !data.type || !data.amount || !data.description?.trim()) {
    throw new Error("Kategori, Tipe, Jumlah, dan Deskripsi transaksi wajib diisi.");
  }

  return prisma.financeTransaction.create({
    data: {
      categoryId: data.categoryId,
      type: data.type,
      amount: Number(data.amount),
      date: data.date ? new Date(data.date) : new Date(),
      paymentMethod: data.paymentMethod || "BANK_TRANSFER",
      reference: data.reference?.trim() || null,
      description: data.description.trim(),
    },
    include: {
      category: true,
    },
  });
}

/**
 * Get all available Finance Categories grouped or sorted.
 */
export async function getFinanceCategories() {
  return prisma.financeCategory.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
}
