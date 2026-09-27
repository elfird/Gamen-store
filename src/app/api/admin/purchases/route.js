import { NextResponse } from "next/server";
import { getPurchases, createPurchase } from "@/services/purchase.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 20;
    const status = searchParams.get("status");
    const supplierId = searchParams.get("supplierId");
    const search = searchParams.get("search");

    const result = await getPurchases({ page, limit, status, supplierId, search });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Purchases GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const purchase = await createPurchase(body);
    return NextResponse.json({
      success: true,
      data: { purchase },
      message: "Purchase order berhasil dibuat.",
    }, { status: 201 });
  } catch (error) {
    console.error("Purchase Create Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
