import { NextResponse } from "next/server";
import { getSuppliers, createSupplier } from "@/services/supplier.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 20;
    const search = searchParams.get("search");
    const active = searchParams.get("active");

    const result = await getSuppliers({ page, limit, search, active });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Suppliers GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const supplier = await createSupplier(body);
    return NextResponse.json({
      success: true,
      data: { supplier },
      message: "Supplier berhasil ditambahkan.",
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
