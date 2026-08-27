"use client";

import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Package, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { useUser } from "@/lib/hooks";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: { name: string; slug: string };
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const router = useRouter();
  const user = useUser();
  const isAdmin = user?.role === "ADMIN";
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Hapus produk "${product.name}"?`)) return;
    setDeleting(true);
    const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/produk");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Gagal menghapus produk");
    }
    setDeleting(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/produk"
          className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-500 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Produk
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-12 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm"
        >
          <div className="aspect-square bg-gradient-to-br from-red-50 to-red-50 dark:from-green-500/10 dark:to-red-500/10 rounded-2xl flex items-center justify-center overflow-hidden">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <motion.span
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="text-8xl"
              >
                🥟
              </motion.span>
            )}
          </div>


          <div className="space-y-6">
            <div>
              <Link
                href={`/produk?category=${product.category.slug}`}
                className="text-sm text-green-500 font-medium hover:underline"
              >
                {product.category.name}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {product.name}
              </h1>
            </div>

            <div className="text-3xl font-bold text-green-500">
              {formatPrice(product.price)}
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">
                  Stok tersedia: {product.stock}
                </span>
              ) : (
                <span className="text-red-500 font-medium">Stok habis</span>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                onClick={() =>
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    stock: product.stock,
                  })
                }
                disabled={product.stock <= 0}
                className="flex-1 gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Tambah ke Keranjang
              </Button>
              {isAdmin && (
                <>
                  <Link href={`/admin/produk/${product.id}/edit`}>
                    <Button size="lg" variant="outline" className="gap-2" title="Edit produk">
                      <Edit className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="danger"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="gap-2"
                    title="Hapus produk"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>

            <div className="border-t dark:border-gray-800 pt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Informasi Produk</h3>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Halal MUI</li>
                <li>• Tanpa pengawet</li>
                <li>• Daging sapi asli</li>
                <li>• Dikirim dalam kemasan vakum</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
