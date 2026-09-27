import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");
    const active = searchParams.get("active");
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);

    const skip = (page - 1) * limit;
    const where = {};

    if (active !== null && active !== undefined && active !== "ALL") {
      where.active = active === "true";
    }

    if (categoryId && categoryId !== "ALL") {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const [products, total, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          variants: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({ where: { active: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products,
        categories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Admin Products GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, slug, model, categoryId, description, condition, warranty, featured, active, variants, images } = body;

    if (!name || !slug || !model || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Nama, slug, model, dan kategori wajib diisi." },
        { status: 400 }
      );
    }

    // Check unique slug
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: `Slug "${slug}" sudah digunakan oleh produk lain.` },
        { status: 409 }
      );
    }

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: name.trim(),
          slug: slug.trim().toLowerCase(),
          model: model.trim(),
          categoryId,
          description: description?.trim() || null,
          condition: condition || "NEW",
          warranty: warranty?.trim() || null,
          featured: Boolean(featured),
          active: active !== undefined ? Boolean(active) : true,
          variants: variants && variants.length > 0 ? {
            create: variants.map((v) => ({
              sku: v.sku.trim().toUpperCase(),
              storage: v.storage.trim(),
              color: v.color.trim(),
              price: Number(v.price),
              purchasePrice: Number(v.purchasePrice || 0),
              stock: Number(v.stock || 0),
              active: v.active !== undefined ? Boolean(v.active) : true,
            })),
          } : undefined,
          images: images && images.length > 0 ? {
            create: images.map((img, idx) => ({
              url: img.url,
              alt: img.alt || name,
              isPrimary: idx === 0,
              sortOrder: idx + 1,
            })),
          } : undefined,
        },
        include: {
          category: true,
          variants: true,
          images: true,
        },
      });

      return created;
    });

    return NextResponse.json({
      success: true,
      data: { product },
      message: "Produk berhasil ditambahkan.",
    }, { status: 201 });
  } catch (error) {
    console.error("Admin Product Create Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
