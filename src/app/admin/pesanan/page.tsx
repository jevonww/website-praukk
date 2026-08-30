
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { Truck, Store, QrCode, CheckCircle, XCircle, Eye } from "lucide-react";

interface Order {
  id: number;
  transactionNumber: string;
  shippingName: string;
  shippingAddress: string | null;
  shippingPhone: string;
  totalAmount: number;
  status: string;
  fulfillment: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentProofUrl: string | null;
  createdAt: string;
  items: { 
    id: number; 
    product: { name: string; imageUrl?: string | null }; 
    quantity: number; 
    price: number 
  }[];
}

const statusColors: Record<string, string> = {
  MENUNGGU: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
  DIKONFIRMASI: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  DIPROSES: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
  DIKIRIM: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400",
  SELESAI: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  DIBATALKAN: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
};

export default function AdminPesananPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []));
  }, []);

  async function updateStatus(id: number, status: string) {
    const res = await fetch(`/api/orders`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    }
  }

  async function verifyPayment(orderId: number, paymentStatus: string) {
    const res = await fetch(`/api/orders/verify-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, paymentStatus }),
    });
    if (res.ok) {
      const data = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
    }
  }

  async function deleteOrder(orderId: number) {
    if (!confirm("Yakin ingin menghapus pesanan ini?")) return;
    const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Kelola Pesanan</h1>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Belum ada pesanan</p>
        ) : (
          orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4 gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                      {order.transactionNumber}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-green-600 dark:bg-green-500/15 dark:text-green-400">
                      {order.fulfillment === "AMBIL_SENDIRI" ? (
                        <>
                          <Store className="w-3 h-3" /> Ambil Sendiri
                        </>
                      ) : (
                        <>
                          <Truck className="w-3 h-3" /> Pengiriman
                        </>
                      )}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{order.shippingName}</h3>
                  <div className="mt-1 text-sm bg-gray-50 dark:bg-gray-800 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 space-y-1">
                    <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5 font-medium">
                      <span className="text-gray-400 font-normal">No. HP:</span> {order.shippingPhone}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="text-gray-400">Alamat:</span> {order.fulfillment === "AMBIL_SENDIRI" ? "Ambil di toko (Pick Up)" : (order.shippingAddress || "-")}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {new Date(order.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-bold text-green-500">
                    {formatPrice(order.totalAmount)}
                  </span>
                  <div className="mt-2 flex flex-col items-end gap-2">
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Hapus
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={order.paymentStatus === "BELUM_DIBAYAR"}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer ${order.paymentStatus === "BELUM_DIBAYAR" ? "opacity-50 cursor-not-allowed" : ""} ${statusColors[order.status] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}
                    >
                      <option value="MENUNGGU">Menunggu</option>
                      <option value="DIKONFIRMASI">Dikonfirmasi</option>
                      <option value="DIPROSES">Diproses</option>
                      <option value="DIKIRIM">Dikirim</option>
                      <option value="SELESAI">Selesai</option>
                      <option value="DIBATALKAN">Dibatalkan</option>
                    </select>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => verifyPayment(order.id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer ${order.paymentStatus === "DIBAYAR" ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"}`}
                    >
                      <option value="BELUM_DIBAYAR">Belum Bayar</option>
                      <option value="DIBAYAR">Sudah Bayar</option>
                    </select>
                    {order.paymentStatus === "BELUM_DIBAYAR" && (
                      <p className="text-xs text-red-500 dark:text-red-400 text-right">
                        Verifikasi pembayaran dulu
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t dark:border-gray-800 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Detail Pesanan:</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.product.imageUrl && (
                            <img src={item.product.imageUrl} alt={item.product.name} className="w-10 h-10 object-cover rounded-md" />
                          )}
                          <span className="text-gray-700 dark:text-gray-200 font-medium">
                            {item.product.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-gray-500 dark:text-gray-400">
                            x{item.quantity}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-sm pt-2 border-t dark:border-gray-700 px-3">

                    <span className="font-bold text-gray-900 dark:text-white">Total Keseluruhan</span>
                    <span className="font-bold text-lg text-green-600 dark:text-green-400">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                <QrCode className="w-3.5 h-3.5" />
                Metode Pembayaran: {order.paymentMethod || "QRIS"}
              </div>

              {order.paymentProofUrl && order.paymentStatus === "BELUM_DIBAYAR" && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg border border-yellow-200 dark:border-yellow-500/20">
                  <div className="flex flex-col gap-3">
                    <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                      Bukti Transfer Menunggu Verifikasi
                    </span>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <img src={order.paymentProofUrl} alt="Bukti Transfer" className="max-w-full max-h-64 object-contain rounded-lg mb-2" />
                    </div>
                    <button
                      onClick={() => window.open(order.paymentProofUrl!, "_blank")}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Lihat Bukti Ukuran Penuh
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => verifyPayment(order.id, "DIBAYAR")}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Verifikasi & Terima
                      </button>
                      <button
                        onClick={() => verifyPayment(order.id, "BELUM_DIBAYAR")}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Tolak
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {order.paymentProofUrl && order.paymentStatus === "DIBAYAR" && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-2">
                    <CheckCircle className="w-4 h-4" />
                    Bukti Transfer Terverifikasi
                  </div>
                  <button
                    onClick={() => window.open(order.paymentProofUrl!, "_blank")}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full"
                  >
                    <Eye className="w-4 h-4" />
                    Lihat Bukti Transfer
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
