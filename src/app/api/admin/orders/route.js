import { NextResponse } from "next/server";
import { getOrders } from "@/services/order.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 20;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const result = await getOrders({ page, limit, status, search, dateFrom, dateTo });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Orders GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
