import { prisma } from "@/lib/prisma";
import { getFinanceOverview } from "./finance.service";
import { getInventoryStats } from "./inventory.service";

/**
 * Calculate date range from filter preset.
 */
function getDateRangeFromPreset(preset = "all") {
  if (preset === "all" || preset === "ALL") {
    return {};
  }

  const now = new Date();
  const end = new Date(now);
  let start = new Date(now);

  switch (preset) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "7d":
      start.setDate(start.getDate() - 7);
      break;
    case "30d":
      start.setDate(start.getDate() - 30);
      break;
    case "3m":
      start.setMonth(start.getMonth() - 90);
      break;
    case "1y":
      start.setFullYear(start.getFullYear() - 1);
      break;
    default:
      return {};
  }

  return { dateFrom: start.toISOString(), dateTo: end.toISOString() };
}

/**
 * Get comprehensive Admin Dashboard metrics.
 */
export async function getDashboardMetrics(preset = "all", customRange = {}) {
  const dateRange = customRange.dateFrom && customRange.dateTo
    ? customRange
    : getDateRangeFromPreset(preset);

  const [
    financeData,
    inventoryStats,
    pendingOrdersCount,
    recentOrders,
    lowStockVariants,
    recentTransactions,
  ] = await Promise.all([
    // 1. Finance & Profit Calculation for the period
    getFinanceOverview(dateRange),

    // 2. Inventory Stats & Total Valuation
    getInventoryStats(),

    // 3. Count Pending Orders
    prisma.order.count({ where: { status: "PENDING" } }),

    // 4. Recent 6 Orders
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        items: true,
      },
    }),

    // 5. Low Stock Variants (active and stock <= 3)
    prisma.productVariant.findMany({
      where: {
        active: true,
        stock: { lte: 3 },
      },
      take: 8,
      include: {
        product: true,
      },
      orderBy: { stock: "asc" },
    }),

    // 6. Recent Activity
    prisma.financeTransaction.findMany({
      take: 6,
      orderBy: { date: "desc" },
      include: {
        category: true,
      },
    }),
  ]);

  // Aggregate monthly / periodic chart data points
  // Fetch completed orders in date range for sales timeline chart
  const orderWhere = { status: "COMPLETED" };
  if (dateRange.dateFrom || dateRange.dateTo) {
    orderWhere.createdAt = {};
    if (dateRange.dateFrom) orderWhere.createdAt.gte = new Date(dateRange.dateFrom);
    if (dateRange.dateTo) orderWhere.createdAt.lte = new Date(dateRange.dateTo);
  }

  const completedOrders = await prisma.order.findMany({
    where: orderWhere,
    select: {
      total: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Group by date for line/bar charts
  const salesByDateMap = {};
  for (const o of completedOrders) {
    const dStr = o.createdAt.toISOString().slice(0, 10);
    salesByDateMap[dStr] = (salesByDateMap[dStr] || 0) + Number(o.total);
  }

  const chartData = Object.entries(salesByDateMap).map(([date, amount]) => ({
    date,
    amount,
  }));

  return {
    period: preset,
    dateRange,
    kpis: {
      totalSales: financeData.salesRevenue,
      totalExpenses: financeData.totalCashOut,
      grossProfit: financeData.grossProfit,
      netProfit: financeData.netProfit,
      netCashFlow: financeData.netCashFlow,
      inventoryValue: inventoryStats.inventoryValue,
      pendingOrdersCount,
      totalUnitsAvailable: inventoryStats.availableUnits,
    },
    charts: {
      salesTimeline: chartData,
      incomeVsExpense: {
        income: financeData.totalCashIn,
        expense: financeData.totalCashOut,
        grossProfit: financeData.grossProfit,
        netProfit: financeData.netProfit,
      },
    },
    tables: {
      recentOrders,
      lowStockVariants,
      recentActivity: recentTransactions,
    },
  };
}
