"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Package, Truck, Store } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LacakPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Masukkan nomor transaksi dulu ya.");
      return;
    }
    setError("");
    setLoading(true);

    const res = await fetch(`/api/orders/track?code=${encodeURIComponent(trimmed)}`);
    if (res.ok) {
      router.push(`/pesanan/${trimmed}`);
    } else {
      const data = await res.json();
      setError(data.error || "Pesanan tidak ditemukan. Cek kembali nomor transaksi kamu.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex p-4 bg-red-50 dark:bg-green-500/15 rounded-2xl mb-5">
            <Package className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lacak Pesanan</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
            Masukkan nomor transaksi kamu untuk cek status pesanan. Cocok kalau belanja sebagai tamu.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 sm:p-8"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nomor Transaksi
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl font-mono uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Contoh: TB-20260802-XXXX"
          />

          {error && (
            <p className="mt-3 text-sm text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3">{error}</p>
          )}

          <Button type="submit" size="lg" className="w-full mt-5 gap-2" disabled={loading}>
            <Search className="w-5 h-5" />
            {loading ? "Mencari..." : "Cek Pesanan"}
          </Button>

          <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4">
              <Truck className="w-5 h-5 text-green-500 shrink-0" />
              <span className="text-gray-600 dark:text-gray-300">Delivery diantar ke alamat</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4">
              <Store className="w-5 h-5 text-green-500 shrink-0" />
              <span className="text-gray-600 dark:text-gray-300">Pick Up diambil di toko</span>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
