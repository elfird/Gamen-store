import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: {
          include: {
            inventoryUnits: {
              where: { status: "AVAILABLE" },
            },
          },
        },
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Produk tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { product } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, model, categoryId, description, condition, warranty, featured, active, variants } = body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Produk tidak ditemukan." }, { status: 404 });
    }

    // If slug changed, check unique
    if (slug && slug !== existing.slug) {
      const conflict = await prisma.product.findUnique({ where: { slug } });
      if (conflict) {
        return NextResponse.json({ success: false, error: "Slug sudah digunakan produk lain." }, { status: 409 });
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update basic product info
      const prod = await tx.product.update({
        where: { id },
        data: {
          name: name !== undefined ? name.trim() : undefined,
          slug: slug !== undefined ? slug.trim().toLowerCase() : undefined,
          model: model !== undefined ? model.trim() : undefined,
          categoryId: categoryId || undefined,
          description: description !== undefined ? description?.trim() || null : undefined,
          condition: condition || undefined,
          warranty: warranty !== undefined ? warranty?.trim() || null : undefined,
          featured: featured !== undefined ? Boolean(featured) : undefined,
          active: active !== undefined ? Boolean(active) : undefined,
        },
      });

      // 2. Upsert/Update variants if provided
      if (variants && Array.isArray(variants)) {
        for (const v of variants) {
          if (v.id) {
            await tx.productVariant.update({
              where: { id: v.id },
              data: {
                sku: v.sku?.trim().toUpperCase(),
                storage: v.storage?.trim(),
                color: v.color?.trim(),
                price: Number(v.price),
                purchasePrice: Number(v.purchasePrice || 0),
                stock: Number(v.stock || 0),
                active: v.active !== undefined ? Boolean(v.active) : true,
              },
            });
          } else {
            await tx.productVariant.create({
              data: {
                productId: id,
                sku: v.sku.trim().toUpperCase(),
                storage: v.storage.trim(),
                color: v.color.trim(),
                price: Number(v.price),
                purchasePrice: Number(v.purchasePrice || 0),
                stock: Number(v.stock || 0),
                active: v.active !== undefined ? Boolean(v.active) : true,
              },
            });
          }
        }
      }

      return tx.product.findUnique({
        where: { id },
        include: { category: true, variants: true, images: true },
      });
    });

    return NextResponse.json({
      success: true,
      data: { product: updated },
      message: "Produk berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Product Update Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    // Check if product has historical orders
    const countOrders = await prisma.orderItem.count({
      where: { variant: { productId: id } },
    });

    // If historical orders exist, perform safe soft archive (active = false)
    if (countOrders > 0) {
      await prisma.product.update({
        where: { id },
        data: { active: false },
      });
      return NextResponse.json({
        success: true,
        message: "Produk memiliki riwayat transaksi dan telah dinonaktifkan (diarsipkan).",
      });
    }

    // Otherwise soft archive as default safe approach
    await prisma.product.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({
      success: true,
      message: "Produk berhasil diarsipkan.",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
