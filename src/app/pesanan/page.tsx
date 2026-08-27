"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  Store,
  LogIn,
  Search,
  ChevronRight,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useUser, useHydrated } from "@/lib/hooks";
import { Button } from "@/components/ui/Button";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: { name: string };
}

interface Order {
  id: number;
  transactionNumber: string;
  status: string;
  fulfillment: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

const statusIcons: Record<string, typeof Package> = {
  MENUNGGU: Clock,
  DIPROSES: Package,
  DIKIRIM: Truck,
  SELESAI: CheckCircle,
};

const statusColors: Record<string, string> = {
  MENUNGGU: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  DIPROSES: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  DIKIRIM: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
  SELESAI: "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400",
};

const statusLabels: Record<string, string> = {
  MENUNGGU: "Menunggu",
  DIPROSES: "Diproses",
  DIKIRIM: "Dikirim",
  SELESAI: "Selesai",
};

export default function PesananPage() {
  const user = useUser();
  const hydrated = useHydrated();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated || !user) return;
    fetch(`/api/orders?userId=${user.id}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, [hydrated, user]);

  if (!hydrated) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center space-y-5 max-w-md">
          <div className="inline-flex p-4 bg-red-50 dark:bg-green-500/15 rounded-2xl">
            <LogIn className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Masuk untuk melihat Pesanan Saya</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Login dulu untuk melihat riwayat pesanan kamu. Kalau kamu belanja sebagai tamu, cek pakai nomor transaksi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full gap-2">
                <LogIn className="w-4 h-4" /> Masuk
              </Button>
            </Link>
            <Link href="/lacak">
              <Button size="lg" variant="outline" className="w-full gap-2">
                <Search className="w-4 h-4" /> Lacak dengan No. Transaksi
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pesanan Saya</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Halo {user.name}, ini daftar pesanan kamu.
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">Belum ada pesanan</h2>
            <p className="text-gray-400 dark:text-gray-500 mt-2">Ayo pesan tahu bakso sekarang!</p>
            <Link
              href="/produk"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors"
            >
              Belanja Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status] || Package;
              const isPickup = order.fulfillment === "AMBIL_SENDIRI";
              const isPaid = order.paymentStatus === "DIBAYAR";
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Link
                    href={`/pesanan/${order.transactionNumber}`}
                    className="block bg-white dark:bg-gray-900 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg ${statusColors[order.status] || "bg-gray-100"}`}>
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {order.transactionNumber}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-gray-100"}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                        <span className="font-bold text-green-500">{formatPrice(order.totalAmount)}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300 truncate">
                            {item.product.name} <span className="text-gray-400">x{item.quantity}</span>
                          </span>
                          <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          +{order.items.length - 2} item lainnya
                        </p>
                      )}
                    </div>

                    <div className="border-t dark:border-gray-800 mt-4 pt-3 flex flex-wrap items-center gap-2 text-xs">
                      <span className={`px-2.5 py-1 rounded-full font-semibold ${isPickup ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400" : "bg-red-100 text-green-600 dark:bg-green-500/15 dark:text-green-400"}`}>
                        {isPickup ? "Ambil Sendiri" : "Pengiriman"}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full font-semibold ${isPaid ? "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"}`}>
                        {isPaid ? "Lunas" : "Belum Bayar"}
                      </span>
                      <span className="ml-auto flex items-center gap-1 text-green-500 font-medium">
                        {isPickup ? <Store className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                        Lihat Detail
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
