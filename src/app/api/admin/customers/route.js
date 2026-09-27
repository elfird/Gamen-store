import { NextResponse } from "next/server";
import { getCustomers } from "@/services/customer.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 20;
    const search = searchParams.get("search");

    const result = await getCustomers({ page, limit, search });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
