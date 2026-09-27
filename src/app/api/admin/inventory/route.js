import { NextResponse } from "next/server";
import { getInventoryUnits, createInventoryUnit, getInventoryStats } from "@/services/inventory.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 20;
    const status = searchParams.get("status");
    const condition = searchParams.get("condition");
    const variantId = searchParams.get("variantId");
    const search = searchParams.get("search");

    const [result, stats] = await Promise.all([
      getInventoryUnits({ page, limit, status, condition, variantId, search }),
      getInventoryStats(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        units: result.units,
        pagination: result.pagination,
        stats,
      },
    });
  } catch (error) {
    console.error("Inventory GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const unit = await createInventoryUnit(body);
    return NextResponse.json({
      success: true,
      data: { unit },
      message: "Unit inventaris berhasil ditambahkan.",
    }, { status: 201 });
  } catch (error) {
    console.error("Inventory POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
