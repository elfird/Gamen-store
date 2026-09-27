import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/services/order.service";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, imeiAssignments, notes } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: "Status pesanan wajib diisi." }, { status: 400 });
    }

    const updated = await updateOrderStatus(id, status, { imeiAssignments, notes });

    return NextResponse.json({
      success: true,
      data: { order: updated },
      message: `Status pesanan berhasil diubah menjadi ${status}.`,
    });
  } catch (error) {
    console.error("Order Status Update Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
