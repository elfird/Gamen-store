import { prisma } from "@/lib/prisma";
import { getFinanceOverview } from "./finance.service";
import { getInventoryStats } from "./inventory.service";

/**
 * 1. Sales Report
 */
export async function getSalesReport({ dateFrom, dateTo } = {}) {
  const where = {};
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const [orders, cancelledCount] = await Promise.all([
    prisma.order.findMany({
      where: { ...where, status: "COMPLETED" },
      include: {
        customer: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({
      where: { ...where, status: "CANCELLED" },
    }),
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const completedOrdersCount = orders.length;
  const averageOrderValue = completedOrdersCount > 0 ? totalRevenue / completedOrdersCount : 0;

  // Best selling products
  const productSalesMap = {};
  for (const order of orders) {
    for (const item of order.items) {
      const key = `${item.productNameSnapshot} (${item.variantSnapshot})`;
      if (!productSalesMap[key]) {
        productSalesMap[key] = { name: key, unitsSold: 0, revenue: 0 };
      }
      productSalesMap[key].unitsSold += item.quantity;
      productSalesMap[key].revenue += Number(item.total);
    }
  }

  const bestSellingProducts = Object.values(productSalesMap).sort(
    (a, b) => b.unitsSold - a.unitsSold
  );

  return {
    totalRevenue,
    completedOrdersCount,
    cancelledOrdersCount: cancelledCount,
    averageOrderValue,
    bestSellingProducts,
    orders,
  };
}

/**
 * 2. Purchase Report
 */
export async function getPurchaseReport({ dateFrom, dateTo } = {}) {
  const where = { status: "CONFIRMED" };
  if (dateFrom || dateTo) {
    where.purchaseDate = {};
    if (dateFrom) where.purchaseDate.gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      where.purchaseDate.lte = end;
    }
  }

  const purchases = await prisma.purchase.findMany({
    where,
    include: {
      supplier: true,
      items: {
        include: {
          variant: { include: { product: true } },
        },
      },
    },
    orderBy: { purchaseDate: "desc" },
  });

  const totalPurchaseValue = purchases.reduce((sum, p) => sum + Number(p.totalAmount), 0);
  const unitsPurchased = purchases.reduce(
    (sum, p) => sum + p.items.reduce((iSum, i) => iSum + i.quantity, 0),
    0
  );

  // Supplier spending breakdown
  const supplierSpendingMap = {};
  for (const p of purchases) {
    const sName = p.supplier.name;
    supplierSpendingMap[sName] = (supplierSpendingMap[sName] || 0) + Number(p.totalAmount);
  }

  const supplierSpending = Object.entries(supplierSpendingMap).map(([name, amount]) => ({
    name,
    amount,
  }));

  return {
    totalPurchaseValue,
    unitsPurchased,
    purchasesCount: purchases.length,
    supplierSpending,
    purchases,
  };
}

/**
 * 3. Profit Report (True COGS & Net Profit)
 */
export async function getProfitReport({ dateFrom, dateTo } = {}) {
  return await getFinanceOverview({ dateFrom, dateTo });
}

/**
 * 4. Inventory Report
 */
export async function getInventoryReport() {
  const stats = await getInventoryStats();

  const [unitsByCondition, lowStockList] = await Promise.all([
    prisma.inventoryUnit.groupBy({
      by: ["condition"],
      _count: { id: true },
    }),
    prisma.productVariant.findMany({
      where: { active: true, stock: { lte: 3 } },
      include: { product: true },
      orderBy: { stock: "asc" },
    }),
  ]);

  return {
    stats,
    unitsByCondition,
    lowStockList,
  };
}
