import { NextResponse } from "next/server";
import { getSupplierById, updateSupplier, toggleSupplierActive } from "@/services/supplier.service";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const supplier = await getSupplierById(id);
    if (!supplier) {
      return NextResponse.json({ success: false, error: "Supplier tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { supplier } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateSupplier(id, body);
    return NextResponse.json({
      success: true,
      data: { supplier: updated },
      message: "Data supplier berhasil diperbarui.",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const toggled = await toggleSupplierActive(id);
    return NextResponse.json({
      success: true,
      data: { supplier: toggled },
      message: `Status supplier berhasil diubah menjadi ${toggled.active ? "Aktif" : "Non-aktif"}.`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
