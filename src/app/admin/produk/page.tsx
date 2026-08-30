import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import ProductActions from "./_components/ProductActions";

export default async function AdminProdukPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Produk</h1>
        <Link
          href="/admin/produk/tambah"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Produk</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Kategori</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Harga</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Stok</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-red-50 to-red-50 dark:from-green-500/10 dark:to-red-500/10 rounded-lg flex items-center justify-center text-xl">
                          🥟
                        </div>
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{p.category.name}</td>
                  <td className="px-6 py-4 font-semibold">{formatPrice(p.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.stock > 0
                        ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                    }`}>
                      {p.stock > 0 ? p.stock : "Habis"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ProductActions id={p.id} name={p.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
