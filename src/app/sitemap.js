import prisma from "@/lib/prisma";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Static routes
  const staticRoutes = [
    "",
    "/products",
    "/sell-iphone",
    "/about",
    "/warranty-check",
    "/track-order",
    "/how-to-order",
    "/faq",
    "/terms",
    "/privacy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/products" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/products" ? 0.9 : 0.7,
  }));

  // Dynamic product routes
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    });

    const productRoutes = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch (err) {
    console.error("Failed to fetch products for sitemap:", err);
    return staticRoutes;
  }
}
