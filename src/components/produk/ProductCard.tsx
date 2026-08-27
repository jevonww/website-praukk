"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useUser } from "@/lib/hooks";
import AdminProductButtons from "./AdminProductButtons";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  slug: string;
  index?: number;
}

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  stock,
  slug,
  index = 0,
}: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);
  const isOutOfStock = stock <= 0;
  const user = useUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10">
          <AdminProductButtons id={id} name={name} />
        </div>
      )}
      <Link href={`/produk/${slug}`} className="block">
        <div className="relative aspect-square bg-gradient-to-br from-green-50 to-red-50 dark:from-green-500/10 dark:to-red-500/10 overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="text-7xl"
              >
                🥟
              </motion.span>
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-800 px-4 py-1 rounded-full text-sm font-bold">
                Habis
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <Link href={`/produk/${slug}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#22c55e] transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#22c55e]">
            {formatPrice(price)}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Stok: {stock}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              addItem({
                id,
                name,
                price,
                imageUrl,
                stock,
              })
            }
            disabled={isOutOfStock}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#22c55e] text-white rounded-lg text-sm font-medium hover:bg-[#16a34a] transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            Keranjang
          </button>
          <Link
            href={`/produk/${slug}`}
            className="flex items-center justify-center w-10 h-10 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-[#22c55e] hover:text-[#22c55e] transition-colors text-gray-500 dark:text-gray-400"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
