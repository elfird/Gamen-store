import { NextResponse } from "next/server";
import { confirmPurchase } from "@/services/purchase.service";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const confirmed = await confirmPurchase(id);
    return NextResponse.json({
      success: true,
      data: { purchase: confirmed },
      message: "Pembelian berhasil dikonfirmasi. Unit inventaris dan mutasi kas pengeluaran telah dicatat otomatis.",
    });
  } catch (error) {
    console.error("Purchase Confirmation Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
