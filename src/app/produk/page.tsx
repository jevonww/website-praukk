import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/produk/ProductCard";
import Link from "next/link";

export default async function ProdukPage(props: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const searchParams = await props.searchParams;
  const categorySlug = searchParams?.category;

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });

  let products;
  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    products = category
      ? await prisma.product.findMany({
          where: { categoryId: category.id },
          orderBy: { createdAt: "desc" },
        })
      : [];
  } else {
    products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {categorySlug
              ? categories.find((c) => c.slug === categorySlug)?.name || "Produk"
              : "Semua Produk"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Nikmati tahu bakso dan aneka produk lainnya
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:hidden overflow-x-auto -mx-4 px-4 mb-6 pb-1 flex gap-2">
          <Link
            href="/produk"
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !categorySlug
                ? "bg-green-500 text-white"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            Semua
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/produk?category=${cat.slug}`}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                categorySlug === cat.slug
                  ? "bg-green-500 text-white"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {cat.name} ({cat._count.products})
            </Link>
          ))}
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-1">
              <Link
                href="/produk"
                className={`block px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  !categorySlug
                    ? "bg-green-500 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-green-500/10 hover:text-green-500"
                }`}
              >
                Semua Produk
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/produk?category=${cat.slug}`}
                  className={`block px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    categorySlug === cat.slug
                      ? "bg-green-500 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-green-500/10 hover:text-green-500"
                  }`}
                >
                  {cat.name} ({cat._count.products})
                </Link>
              ))}
            </div>
          </aside>

          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 dark:text-gray-500 text-lg">Tidak ada produk di kategori ini</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    price={p.price}
                    imageUrl={p.imageUrl}
                    stock={p.stock}
                    slug={p.slug}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
