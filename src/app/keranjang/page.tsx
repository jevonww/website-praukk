"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useHydrated } from "@/lib/hooks";

export default function KeranjangPage() {
  const isMounted = useHydrated();
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <ShoppingBag className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Keranjang Kosong</h2>
          <p className="text-gray-500 dark:text-gray-400">Yuk, isi keranjang dengan tahu bakso favoritmu!</p>
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Belanja Sekarang
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Keranjang Belanja</h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Hapus Semua
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 shadow-sm flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-50 dark:from-green-500/10 dark:to-red-500/10 rounded-xl flex items-center justify-center text-2xl shrink-0">
                🥟
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/produk/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="font-semibold text-gray-900 dark:text-white hover:text-green-500 transition-colors line-clamp-1"
                >
                  {item.name}
                </Link>
                <p className="text-green-500 font-bold mt-1">{formatPrice(item.price)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-400 hover:text-green-500 transition-colors text-gray-500 dark:text-gray-400"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-400 hover:text-green-500 transition-colors text-gray-500 dark:text-gray-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right w-24">
                <p className="font-bold text-gray-900 dark:text-white">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg text-gray-600 dark:text-gray-300">Total Belanja</span>
            <span className="text-2xl font-bold text-green-500">
              {formatPrice(totalPrice())}
            </span>
          </div>
          <Link href="/checkout">
            <Button size="lg" className="w-full gap-2">
              <ShoppingBag className="w-5 h-5" />
              Lanjut ke Checkout
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
