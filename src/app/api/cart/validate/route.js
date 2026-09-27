import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * POST /api/cart/validate
 *
 * Validates cart items against the authoritative database state.
 * - Verifies current prices (never trust client prices)
 * - Verifies available stock (stock - reservedStock)
 * - Flags out-of-stock or adjusted quantity items
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { items = [] } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        valid: true,
        items: [],
        subtotal: 0,
        hasAdjustments: false,
      });
    }

    const variantIds = items.map((i) => i.variantId).filter(Boolean);

    // Query active variants from database
    const dbVariants = await prisma.productVariant.findMany({
      where: {
        id: { in: variantIds },
        active: true,
        product: { active: true },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            condition: true,
            warranty: true,
            images: {
              take: 1,
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
    });

    const variantMap = new Map(dbVariants.map((v) => [v.id, v]));

    let validatedSubtotal = 0;
    let hasAdjustments = false;
    const validatedItems = [];

    for (const item of items) {
      const dbVariant = variantMap.get(item.variantId);

      if (!dbVariant) {
        // Variant no longer exists or inactive
        hasAdjustments = true;
        continue;
      }

      const availableStock = Math.max(0, dbVariant.stock - (dbVariant.reservedStock || 0));
      const requestedQty = Number(item.quantity) || 1;
      const validQty = Math.min(requestedQty, availableStock);

      if (validQty !== requestedQty) {
        hasAdjustments = true;
      }

      const unitPrice = Number(dbVariant.price);
      const itemSubtotal = unitPrice * validQty;
      validatedSubtotal += itemSubtotal;

      validatedItems.push({
        variantId: dbVariant.id,
        productId: dbVariant.product.id,
        name: dbVariant.product.name,
        slug: dbVariant.product.slug,
        storage: dbVariant.storage,
        color: dbVariant.color,
        sku: dbVariant.sku,
        price: unitPrice,
        availableStock,
        quantity: validQty,
        condition: dbVariant.product.condition,
        warranty: dbVariant.product.warranty,
        image: dbVariant.product.images[0]?.url || null,
        isStockAdjusted: validQty < requestedQty,
      });
    }

    return NextResponse.json({
      valid: !hasAdjustments,
      hasAdjustments,
      items: validatedItems,
      subtotal: validatedSubtotal,
    });
  } catch (error) {
    console.error("Cart validation error:", error);
    return NextResponse.json(
      { error: "Gagal memvalidasi keranjang belanja" },
      { status: 500 }
    );
  }
}
