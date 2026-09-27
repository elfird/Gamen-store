import { NextResponse } from "next/server";
import { getInventoryUnitById, updateInventoryUnit } from "@/services/inventory.service";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const unit = await getInventoryUnitById(id);
    if (!unit) {
      return NextResponse.json({ success: false, error: "Unit inventaris tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { unit } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateInventoryUnit(id, body);
    return NextResponse.json({
      success: true,
      data: { unit: updated },
      message: "Unit inventaris berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Inventory Unit Update Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
