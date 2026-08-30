"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  Store,
  QrCode,
  MapPin,
  Clock,
  CreditCard,
  Banknote,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useHydrated, useUser } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const PICKUP_INFO = {
  name: "TahuBakso Store",
  address: "Jl. Merdeka No. 88, Kec. Tahu, Kota Bakso 40231",
  hours: "Senin - Minggu, 08.00 - 21.00",
  phone: "0812-3456-7890",
};

type Fulfillment = "DELIVERY" | "PICKUP";
type PaymentMethod = "QRIS" | "BANK_TRANSFER";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const isMounted = useHydrated();
  const user = useUser();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("DELIVERY");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("QRIS");
  const [form, setForm] = useState({
    name: user?.name || "",
    address: user?.address || "",
    phone: user?.phone || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingBag className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tidak ada item</h2>
          <p className="text-gray-500 dark:text-gray-400">Tambahkan produk dulu ya!</p>
          <Link href="/produk" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Belanja Yuk
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name || user?.name || "",
          address: form.address,
          phone: form.phone,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity, price: i.price })),
          total: totalPrice(),
          userId: user?.id ?? null,
          fulfillment,
          paymentMethod,
        }),
    });

    if (res.ok) {
      const data = await res.json();
      clearCart();
      router.push(`/pesanan/${data.order.transactionNumber}`);
    } else {
      const data = await res.json();
      setError(data.error || "Gagal membuat pesanan. Coba lagi.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

        <div className="grid md:grid-cols-5 gap-6 lg:gap-8">
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="md:col-span-3 space-y-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Metode Pengambilan</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillment("DELIVERY")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                    fulfillment === "DELIVERY"
                      ? "border-green-500 bg-red-50 dark:bg-green-500/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-green-300"
                  )}
                >
                  <Truck className={cn("w-6 h-6", fulfillment === "DELIVERY" ? "text-green-500" : "text-gray-400")} />
                  <span className="font-medium text-sm text-gray-900 dark:text-white">Delivery</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 text-center">Diantar ke alamat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillment("PICKUP")}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                    fulfillment === "PICKUP"
                      ? "border-green-500 bg-red-50 dark:bg-green-500/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-green-300"
                  )}
                >
                  <Store className={cn("w-6 h-6", fulfillment === "PICKUP" ? "text-green-500" : "text-gray-400")} />
                  <span className="font-medium text-sm text-gray-900 dark:text-white">Pick Up</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 text-center">Ambil di toko</span>
                </button>
              </div>

              {fulfillment === "PICKUP" && (
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 text-sm space-y-2">
                  <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Store className="w-4 h-4 text-green-500" /> {PICKUP_INFO.name}
                  </p>
                  <p className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {PICKUP_INFO.address}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4 text-green-500" />
                    {PICKUP_INFO.hours}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Data {fulfillment === "PICKUP" ? "Pemesan" : "Pengiriman"}
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nama kamu"
                  />
                </div>

                {fulfillment === "DELIVERY" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alamat Lengkap</label>
                    <textarea
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
                      placeholder="Alamat lengkap (jalan, no. rumah, kecamatan, kota)"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No. HP</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0812-3456-7890"
                  />
                </div>

              {user && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  Pesanan akan tercatat di akun kamu (Pesanan Saya).
                </p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Metode Pembayaran</h2>
              
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("QRIS")}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                    paymentMethod === "QRIS"
                      ? "border-green-500 bg-red-50 dark:bg-green-500/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-green-300"
                  )}
                >
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">QRIS</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Scan setelah pesanan dibuat. Bayar cepat & mudah.
                    </p>
                  </div>
                  {paymentMethod === "QRIS" && (
                    <span className="text-xs font-semibold text-green-500 bg-green-100 dark:bg-green-500/20 px-2 py-1 rounded-full">
                      Aktif
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("BANK_TRANSFER")}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-green-500 bg-red-50 dark:bg-green-500/10"
                      : "border-gray-200 dark:border-gray-700 hover:border-green-300"
                  )}
                >
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Transfer Bank</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Kirim bukti transfer. Verifikasi admin sebelum diproses.
                    </p>
                  </div>
                  {paymentMethod === "BANK_TRANSFER" && (
                    <span className="text-xs font-semibold text-green-500 bg-green-100 dark:bg-green-500/20 px-2 py-1 rounded-full">
                      Aktif
                    </span>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3">{error}</p>
            )}

            <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
              {loading ? "Memproses..." : `Buat Pesanan & Bayar ${paymentMethod === "QRIS" ? "QRIS" : "Transfer"}`}
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm md:sticky md:top-24">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Ringkasan Pesanan</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm gap-2">
                    <span className="text-gray-600 dark:text-gray-300 truncate">
                      {item.name} <span className="text-gray-400">x{item.quantity}</span>
                    </span>
                    <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t dark:border-gray-800 pt-4 flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-green-500">{formatPrice(totalPrice())}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
