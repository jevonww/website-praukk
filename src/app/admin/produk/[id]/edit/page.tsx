import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "../../_components/ProductForm";

export default async function EditProdukPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: parseInt(id) } }),
    prisma.category.findMany({ orderBy: { id: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Edit Produk</h1>
      <ProductForm
        initial={{
          id: product.id,
          name: product.name,
          description: product.description ?? "",
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId,
        }}
        categories={categories}
        mode="edit"
      />
    </div>
  );
}
