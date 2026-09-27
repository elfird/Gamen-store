import { NextResponse } from "next/server";
import { getFinanceTransactions, createFinanceTransaction } from "@/services/finance.service";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 20;
    const type = searchParams.get("type");
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const result = await getFinanceTransactions({
      page,
      limit,
      type,
      categoryId,
      search,
      dateFrom,
      dateTo,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const transaction = await createFinanceTransaction(body);
    return NextResponse.json({
      success: true,
      data: { transaction },
      message: "Transaksi keuangan berhasil dicatat.",
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
