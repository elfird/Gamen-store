import { NextResponse } from "next/server";
import { getCustomerById, updateCustomer } from "@/services/customer.service";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const customer = await getCustomerById(id);
    if (!customer) {
      return NextResponse.json({ success: false, error: "Pelanggan tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { customer } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateCustomer(id, body);
    return NextResponse.json({
      success: true,
      data: { customer: updated },
      message: "Data pelanggan berhasil diperbarui.",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
