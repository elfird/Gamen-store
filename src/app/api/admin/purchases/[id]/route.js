import { NextResponse } from "next/server";
import { getPurchaseById } from "@/services/purchase.service";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const purchase = await getPurchaseById(id);
    if (!purchase) {
      return NextResponse.json({ success: false, error: "Pembelian tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { purchase } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
