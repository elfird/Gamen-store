import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

/**
 * Generate formatted order number: ORD-YYYYMMDD-XXXX
 */
export async function generateOrderNumber(tx = prisma) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePrefix = `ORD-${year}${month}${day}`;

  // Count orders created today with this prefix
  const countToday = await tx.order.count({
    where: {
      orderNumber: {
        startsWith: datePrefix,
      },
    },
  });

  const sequence = String(countToday + 1).padStart(4, "0");
  let orderNumber = `${datePrefix}-${sequence}`;

  // Ensure uniqueness
  let exists = await tx.order.findUnique({ where: { orderNumber } });
  let counter = countToday + 1;
  while (exists) {
    counter++;
    orderNumber = `${datePrefix}-${String(counter).padStart(4, "0")}`;
    exists = await tx.order.findUnique({ where: { orderNumber } });
  }

  return orderNumber;
}

/**
 * Build WhatsApp order message deep link.
 */
export function generateWhatsAppOrderMessage(order, storePhone = process.env.WHATSAPP_NUMBER || "6281234567890") {
  // Format clean phone number (e.g. 0812 -> 62812)
  let cleanPhone = storePhone.replace(/[^0-9]/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.slice(1);
  }

  const itemsList = order.items
    .map((item) => {
      return `• *${item.productNameSnapshot}*\n  Varian: ${item.variantSnapshot}\n  Qty: ${item.quantity}x\n  Harga: ${formatCurrency(item.sellingPrice)}`;
    })
    .join("\n\n");

  const totalFormatted = formatCurrency(order.total);
  const deliveryText = order.deliveryMethod === "PICKUP" ? "Ambil di Toko (Pickup)" : "Pengiriman ke Alamat (Delivery)";

  const message = `Halo Gamen Store, saya ingin melakukan pemesanan.

*Order ID:*
${order.orderNumber}

*Rincian Produk:*
${itemsList}

*Metode Pengiriman:*
${deliveryText}
${order.address ? `*Alamat Pengiriman:*\n${order.address}\n` : ""}
*Total Tagihan:*
*${totalFormatted}*

*Data Pemesan:*
Nama: ${order.customer?.name || "-"}
No. WhatsApp: ${order.customer?.whatsapp || "-"}
${order.customer?.email ? `Email: ${order.customer.email}\n` : ""}${order.notes ? `Catatan: ${order.notes}\n` : ""}
Mohon informasi mengenai proses konfirmasi dan pembayaran selanjutnya. Terima kasih!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Server-side Order Creation with strict validation and atomic transaction.
 * Does NOT decrease inventory units or mark as SOLD. Order starts as PENDING.
 */
export async function createOrder({
  customer: customerData,
  items: requestItems,
  deliveryMethod = "DELIVERY",
  shippingAddress = {},
  notes = "",
}) {
  // 1. Validate Customer Data
  if (!customerData?.name || !customerData?.whatsapp) {
    throw new Error("Nama lengkap dan nomor WhatsApp pemesan wajib diisi.");
  }

  const cleanWhatsApp = customerData.whatsapp.replace(/[^0-9]/g, "");
  if (cleanWhatsApp.length < 8) {
    throw new Error("Nomor WhatsApp tidak valid.");
  }

  // 2. Validate Items
  if (!Array.isArray(requestItems) || requestItems.length === 0) {
    throw new Error("Keranjang belanja kosong.");
  }

  return await prisma.$transaction(async (tx) => {
    // 3. Find or Create Customer
    let customer = await tx.customer.findFirst({
      where: { whatsapp: cleanWhatsApp },
    });

    const fullAddress = deliveryMethod === "DELIVERY"
      ? [
          shippingAddress.address,
          shippingAddress.district,
          shippingAddress.city,
          shippingAddress.province,
          shippingAddress.postalCode,
        ]
          .filter(Boolean)
          .join(", ")
      : "Ambil di Toko (Pickup)";

    if (customer) {
      customer = await tx.customer.update({
        where: { id: customer.id },
        data: {
          name: customerData.name.trim(),
          email: customerData.email ? customerData.email.trim() : customer.email,
          province: shippingAddress.province || customer.province,
          city: shippingAddress.city || customer.city,
          district: shippingAddress.district || customer.district,
          postalCode: shippingAddress.postalCode || customer.postalCode,
          address: fullAddress || customer.address,
        },
      });
    } else {
      customer = await tx.customer.create({
        data: {
          name: customerData.name.trim(),
          whatsapp: cleanWhatsApp,
          email: customerData.email ? customerData.email.trim() : null,
          province: shippingAddress.province || null,
          city: shippingAddress.city || null,
          district: shippingAddress.district || null,
          postalCode: shippingAddress.postalCode || null,
          address: fullAddress,
        },
      });
    }

    // 4. Validate Product Variants & Stock from authoritative Database
    let calculatedSubtotal = 0;
    const preparedOrderItems = [];

    for (const item of requestItems) {
      if (!item.variantId || !item.quantity || item.quantity <= 0) {
        throw new Error("Data item pesanan tidak valid.");
      }

      const variant = await tx.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant || !variant.active || !variant.product.active) {
        throw new Error(`Produk tidak tersedia atau telah dinonaktifkan.`);
      }

      // Check available stock (stock - reservedStock)
      const availableStock = Math.max(0, variant.stock - variant.reservedStock);
      if (item.quantity > availableStock) {
        throw new Error(
          `Stok untuk ${variant.product.name} (${variant.storage} - ${variant.color}) tidak mencukupi. Tersedia: ${availableStock} unit.`
        );
      }

      const actualPrice = Number(variant.price);
      const actualPurchasePrice = Number(variant.purchasePrice || 0);
      const itemTotal = actualPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      preparedOrderItems.push({
        variantId: variant.id,
        productNameSnapshot: variant.product.name,
        variantSnapshot: `${variant.storage} · ${variant.color}`,
        quantity: item.quantity,
        sellingPrice: actualPrice,
        purchaseCost: actualPurchasePrice,
        total: itemTotal,
      });
    }

    // 5. Calculate Shipping & Total
    const shippingCost = deliveryMethod === "DELIVERY" ? 0 : 0; // Free shipping promo default / configurable
    const total = calculatedSubtotal + shippingCost;

    // 6. Generate Order Number
    const orderNumber = await generateOrderNumber(tx);

    // 7. Create Order Record (Status: PENDING)
    const order = await tx.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        status: "PENDING",
        subtotal: calculatedSubtotal,
        shippingCost,
        discount: 0,
        total,
        deliveryMethod: deliveryMethod === "PICKUP" ? "PICKUP" : "DELIVERY",
        address: fullAddress,
        notes: notes ? notes.trim() : null,
        items: {
          create: preparedOrderItems,
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });

    // 8. Generate WhatsApp Deep Link
    const whatsappUrl = generateWhatsAppOrderMessage(order);

    return {
      order,
      whatsappUrl,
    };
  });
}

/**
 * Get Paginated Orders with filters.
 */
export async function getOrders({
  page = 1,
  limit = 20,
  status,
  search,
  dateFrom,
  dateTo,
} = {}) {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where = {};

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { customer: { name: { contains: search, mode: "insensitive" } } },
      { customer: { whatsapp: { contains: search, mode: "insensitive" } } },
      { customer: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        items: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get Order by ID with full details.
 */
export async function getOrderById(id) {
  if (!id) return null;
  return prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          variant: {
            include: {
              product: true,
              inventoryUnits: {
                where: { status: { in: ["AVAILABLE", "RESERVED"] } },
              },
            },
          },
          inventoryUnit: true,
        },
      },
      transactions: true,
    },
  });
}

/**
 * Get Order by Order Number (for storefront confirmation).
 */
export async function getOrderByOrderNumber(orderNumber) {
  if (!orderNumber) return null;
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      customer: true,
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  });
}

/**
 * Update Order Status with complete Inventory & Finance lifecycle state machine.
 */
export async function updateOrderStatus(orderId, newStatus, { imeiAssignments = {}, notes } = {}) {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: true,
            inventoryUnit: true,
          },
        },
        customer: true,
        transactions: true,
      },
    });

    if (!order) {
      throw new Error("Pesanan tidak ditemukan.");
    }

    const previousStatus = order.status;
    if (previousStatus === newStatus) {
      return order; // No change needed
    }

    // ─── Transition Logic ────────────────────────────────────────────────────────

    // 1. Transitioning TO 'CONFIRMED': Reserve inventory units
    if (newStatus === "CONFIRMED" && previousStatus !== "CONFIRMED") {
      for (const item of order.items) {
        // Increment reserved stock on variant
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            reservedStock: { increment: item.quantity },
          },
        });

        // Optionally link available inventory unit if assigned
        const assignedImei = imeiAssignments[item.id];
        if (assignedImei) {
          const unit = await tx.inventoryUnit.findUnique({ where: { imei: assignedImei } });
          if (unit && unit.status === "AVAILABLE") {
            await tx.inventoryUnit.update({
              where: { id: unit.id },
              data: { status: "RESERVED" },
            });
            await tx.orderItem.update({
              where: { id: item.id },
              data: { inventoryUnitId: unit.id },
            });
          }
        }
      }
    }

    // 2. Transitioning TO 'COMPLETED': Mark sold, deduct stock, record Revenue & COGS
    if (newStatus === "COMPLETED" && previousStatus !== "COMPLETED") {
      let calculatedTotalCogs = 0;

      for (const item of order.items) {
        // Decrease actual stock and reservedStock
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: { decrement: item.quantity },
            reservedStock: {
              decrement: previousStatus === "CONFIRMED" || previousStatus === "PROCESSING" || previousStatus === "SHIPPED"
                ? item.quantity
                : 0,
            },
          },
        });

        // If unit is linked, mark as SOLD
        if (item.inventoryUnitId) {
          const unit = await tx.inventoryUnit.findUnique({ where: { id: item.inventoryUnitId } });
          if (unit) {
            await tx.inventoryUnit.update({
              where: { id: unit.id },
              data: {
                status: "SOLD",
                soldAt: new Date(),
                soldOrderId: order.id,
                sellingPrice: item.sellingPrice,
              },
            });
            const unitCost = Number(unit.purchasePrice);
            calculatedTotalCogs += unitCost * item.quantity;
            await tx.orderItem.update({
              where: { id: item.id },
              data: { purchaseCost: unitCost },
            });
          }
        } else {
          // Fallback: pick available inventory unit or use variant's purchasePrice
          const unit = await tx.inventoryUnit.findFirst({
            where: { variantId: item.variantId, status: "AVAILABLE" },
          });
          if (unit) {
            await tx.inventoryUnit.update({
              where: { id: unit.id },
              data: {
                status: "SOLD",
                soldAt: new Date(),
                soldOrderId: order.id,
                sellingPrice: item.sellingPrice,
              },
            });
            const unitCost = Number(unit.purchasePrice);
            calculatedTotalCogs += unitCost * item.quantity;
            await tx.orderItem.update({
              where: { id: item.id },
              data: {
                inventoryUnitId: unit.id,
                purchaseCost: unitCost,
              },
            });
          } else {
            const fallbackCost = Number(item.variant.purchasePrice || 0);
            calculatedTotalCogs += fallbackCost * item.quantity;
          }
        }
      }

      // Record Sales Income Transaction in Finance (avoid duplicate)
      const existingIncome = await tx.financeTransaction.findFirst({
        where: { orderId: order.id, type: "INCOME" },
      });

      if (!existingIncome) {
        let salesCat = await tx.financeCategory.findFirst({
          where: { type: "INCOME", name: { contains: "Penjualan" } },
        });

        if (!salesCat) {
          salesCat = await tx.financeCategory.create({
            data: {
              name: "Penjualan Unit iPhone",
              type: "INCOME",
              description: "Pendapatan dari penjualan produk iPhone",
            },
          });
        }

        await tx.financeTransaction.create({
          data: {
            categoryId: salesCat.id,
            type: "INCOME",
            amount: order.total,
            date: new Date(),
            paymentMethod: "BANK_TRANSFER",
            reference: order.orderNumber,
            description: `Penerimaan pelunasan pesanan ${order.orderNumber} (${order.customer.name})`,
            orderId: order.id,
          },
        });
      }
    }

    // 3. Transitioning TO 'CANCELLED': Release any reservations
    if (newStatus === "CANCELLED" && previousStatus !== "CANCELLED") {
      // If was previously reserved
      if (["CONFIRMED", "PROCESSING", "SHIPPED"].includes(previousStatus)) {
        for (const item of order.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              reservedStock: { decrement: item.quantity },
            },
          });

          if (item.inventoryUnitId) {
            await tx.inventoryUnit.update({
              where: { id: item.inventoryUnitId },
              data: { status: "AVAILABLE" },
            });
          }
        }
      }
    }

    // Update order status and timestamps
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        notes: notes !== undefined ? notes : order.notes,
        completedAt: newStatus === "COMPLETED" ? new Date() : order.completedAt,
        cancelledAt: newStatus === "CANCELLED" ? new Date() : order.cancelledAt,
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return updatedOrder;
  });
}
