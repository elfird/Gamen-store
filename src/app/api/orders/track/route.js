import { NextResponse } from "next/server";
import { getOrderByOrderNumber } from "@/services/order.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber")?.trim();

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "Nomor pesanan wajib diisi." },
        { status: 400 }
      );
    }

    const order = await getOrderByOrderNumber(orderNumber);

    if (!order) {
      return NextResponse.json({
        success: true,
        data: { found: false, orderNumber },
      });
    }

    // Return safe public tracking data (protect private payment/cost snapshots)
    return NextResponse.json({
      success: true,
      data: {
        found: true,
        order: {
          orderNumber: order.orderNumber,
          status: order.status,
          createdAt: order.createdAt,
          total: Number(order.total),
          deliveryMethod: order.deliveryMethod,
          address: order.address,
          customerName: order.customer?.name,
          items: (order.items || []).map((item) => ({
            name: item.productNameSnapshot,
            variant: item.variantSnapshot,
            quantity: item.quantity,
            price: Number(item.sellingPrice),
          })),
        },
      },
    });
  } catch (error) {
    console.error("Error tracking order:", error);
    return NextResponse.json(
      { success: false, error: "Gagal melacak pesanan." },
      { status: 500 }
    );
  }
}
