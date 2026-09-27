import { NextResponse } from "next/server";
import { createOrder } from "@/services/order.service";

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, items, deliveryMethod, shippingAddress, notes } = body;

    // Call service to validate, compute authoritative prices & create order
    const result = await createOrder({
      customer,
      items,
      deliveryMethod,
      shippingAddress,
      notes,
    });

    return NextResponse.json({
      success: true,
      data: {
        order: result.order,
        whatsappUrl: result.whatsappUrl,
      },
      message: "Pesanan berhasil dibuat.",
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal memproses pesanan. Silakan coba lagi.",
      },
      { status: 400 }
    );
  }
}
