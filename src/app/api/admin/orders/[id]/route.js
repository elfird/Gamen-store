import { NextResponse } from "next/server";
import { getOrderById } from "@/services/order.service";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { order } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
