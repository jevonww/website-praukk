import { prisma } from "@/lib/prisma";
import ProductForm from "../_components/ProductForm";

export default async function TambahProdukPage() {
  const categories = await prisma.category.findMany({ orderBy: { id: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Tambah Produk</h1>
      <ProductForm categories={categories} mode="create" />
    </div>
  );
}
