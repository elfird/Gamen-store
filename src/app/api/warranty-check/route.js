import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("imei")?.trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Nomor IMEI atau Serial Number wajib diisi." },
        { status: 400 }
      );
    }

    const cleanQuery = query.replace(/[^a-zA-Z0-9]/g, "");

    // Search by exact IMEI or Serial Number in InventoryUnits
    const unit = await prisma.inventoryUnit.findFirst({
      where: {
        OR: [
          { imei: { equals: cleanQuery, mode: "insensitive" } },
          { serialNumber: { equals: cleanQuery, mode: "insensitive" } },
        ],
      },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!unit) {
      return NextResponse.json({
        success: true,
        data: {
          found: false,
          query: cleanQuery,
        },
      });
    }

    // Mask IMEI for security (e.g. 358940******123)
    const imeiStr = unit.imei;
    const maskedImei =
      imeiStr.length >= 8
        ? `${imeiStr.slice(0, 6)}******${imeiStr.slice(-3)}`
        : imeiStr;

    return NextResponse.json({
      success: true,
      data: {
        found: true,
        imeiMasked: maskedImei,
        serialNumber: unit.serialNumber,
        productName: unit.variant?.product?.name || "Apple iPhone",
        model: unit.variant?.product?.model || "-",
        storage: unit.variant?.storage || "-",
        color: unit.variant?.color || "-",
        condition: unit.condition,
        batteryHealth: unit.batteryHealth ? `${unit.batteryHealth}%` : "100% (Prima)",
        warranty: unit.variant?.product?.warranty || "1 Tahun Garansi Resmi",
        signalStatus: "100% Permanen Terdaftar Kemenperin / Bea Cukai",
        isSold: unit.status === "SOLD",
      },
    });
  } catch (error) {
    console.error("Error in warranty-check API:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memeriksa status IMEI." },
      { status: 500 }
    );
  }
}
