// Kode di sini menangani lacak pesanan berdasarkan transactionNumber (order code)
// User tidak perlu login, cukup memiliki kode transaksi yang diberikan saat checkout.
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
  MapPin,
  Phone,
  User,
  QrCode,
  ArrowLeft,
  ShieldCheck,
  Copy,
  Check,
  Eye,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { QRISDisplay } from "@/components/ui/QRISDisplay";
import { Button } from "@/components/ui/Button";
import { useUser, useHydrated } from "@/lib/hooks";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: { name: string; imageUrl: string | null };
}

interface Order {
  id: number;
  transactionNumber: string;
  status: string;
  fulfillment: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentProofUrl: string | null;
  totalAmount: number;
  shippingName: string;
  shippingAddress: string | null;
  shippingPhone: string;
  createdAt: string;
  items: OrderItem[];
}

const statusIcons: Record<string, typeof Package> = {
  MENUNGGU: Clock,
  DIKONFIRMASI: CheckCircle,
  DIPROSES: Package,
  DIKIRIM: Truck,
  SELESAI: CheckCircle,
  DIBATALKAN: CheckCircle,
};

const statusColors: Record<string, string> = {
  MENUNGGU: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
  DIKONFIRMASI: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  DIPROSES: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
  DIKIRIM: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
  SELESAI: "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  DIBATALKAN: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

const statusLabels: Record<string, string> = {
  MENUNGGU: "Menunggu",
  DIKONFIRMASI: "Dikonfirmasi",
  DIPROSES: "Diproses",
  DIKIRIM: "Dikirim",
  SELESAI: "Selesai",
  DIBATALKAN: "Dibatalkan",
};

const steps = ["MENUNGGU", "DIKONFIRMASI", "DIPROSES", "DIKIRIM", "SELESAI"];

export default function OrderDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const user = useUser();
  const hydrated = useHydrated();
  const [code, setCode] = useState<string>("");
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);

  useEffect(() => {
    params.then((p) => setCode(p.code));
  }, [params]);

  useEffect(() => {
    if (!code) return;
    fetch(`/api/orders/track?code=${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.order) {
          setOrder(d.order);
          setNotFound(false);
        } else {
          setOrder(null);
          setNotFound(true);
        }
      })
      .catch(() => {
        setOrder(null);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [code]);

  async function markPaid() {
    if (!order) return;
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, paymentStatus: "DIBAYAR" }),
    });
    if (res.ok) {
      setOrder((prev) => (prev ? { ...prev, paymentStatus: "DIBAYAR" } : prev));
    }
  }

  async function uploadPaymentProof() {
    if (!order || !proofFile) return;
    setUploadingProof(true);
    try {
      const formData = new FormData();
      formData.append("transactionNumber", order.transactionNumber);
      formData.append("paymentProof", proofFile);

      const res = await fetch("/api/orders/upload-proof", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setProofFile(null);
        // Removed window.location.reload()

      } else {
        const error = await res.json();
        console.error("Upload proof error:", error);
        alert(error.error || "Gagal upload bukti transfer");
      }
    } catch (error) {
      console.error("Upload proof error:", error);
      alert("Gagal upload bukti transfer");
    } finally {
      setUploadingProof(false);
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(order?.transactionNumber || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order || notFound) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <Package className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pesanan tidak ditemukan</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Pastikan nomor transaksi sudah benar, atau cek kembali pesanan kamu.
          </p>
          <Link href="/lacak" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Lacak Pesanan
          </Link>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[order.status] || Package;
  const currentStep = steps.indexOf(order.status);
  const isPickup = order.fulfillment === "AMBIL_SENDIRI";
  const isPaid = order.paymentStatus === "DIBAYAR";
  const isBankTransfer = order.paymentMethod === "BANK_TRANSFER";
  const hasProof = !!order.paymentProofUrl;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href={hydrated && user ? "/pesanan" : "/lacak"}
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors mb-6"
          >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">No. Transaksi</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono font-bold text-lg text-gray-900 dark:text-white">{order.transactionNumber}</p>
                  <button
                    onClick={copyCode}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                    aria-label="Salin nomor transaksi"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusColors[order.status]}`}>
                <StatusIcon className="w-4 h-4" />
                <span className="font-semibold text-sm">{statusLabels[order.status]}</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {new Date(order.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <div className="flex items-center gap-2 mb-6">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${isPickup ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400" : "bg-red-100 text-green-600 dark:bg-green-500/15 dark:text-green-400"}`}>
                {isPickup ? <Store className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                {isPickup ? "Ambil Sendiri" : "Pengiriman"}
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${isPaid ? "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"}`}>
                <QrCode className="w-3.5 h-3.5" />
                {isPaid ? "Pembayaran Lunas" : "Belum Dibayar"}
              </div>
            </div>

            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm gap-2">
                  <span className="text-gray-600 dark:text-gray-300 truncate">
                    {item.product.name} <span className="text-gray-400">x{item.quantity}</span>
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t dark:border-gray-800 mt-4 pt-4 flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">Total</span>
              <span className="text-xl font-bold text-green-500">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Status Pesanan</h2>
            <div className="flex items-center">
              {steps.map((step, i) => {
                const done = i <= currentStep;
                const isLast = i === steps.length - 1;
                return (
                  <div key={step} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
                    <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${done ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400"}`}>
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className={`mt-1 text-[10px] font-medium ${done ? "text-green-500" : "text-gray-400 dark:text-gray-500"}`}>
                      {statusLabels[step]}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`h-0.5 flex-1 mx-1 mb-4 ${i < currentStep ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

            {!isPaid && !isBankTransfer && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-green-500" />
                  Bayar dengan QRIS
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Scan kode QRIS di bawah ini menggunakan aplikasi e-wallet atau mobile banking kamu, lalu selesaikan pembayaran.
                </p>
                <QRISDisplay code={order.transactionNumber} amount={order.totalAmount} />
                <div className="mt-6 pt-4 border-t dark:border-gray-800">
                  {hasProof ? (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bukti Pembayaran Terupload:</p>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <img src={order.paymentProofUrl!} alt="Bukti Pembayaran" className="max-w-full h-auto rounded-lg mb-3" />
                        <Button
                          onClick={() => window.open(order.paymentProofUrl!, "_blank")}
                          variant="outline"
                          className="w-full gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Lihat Bukti Pembayaran
                        </Button>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                          Admin akan memverifikasi pembayaran Anda.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Atau Upload Bukti Pembayaran</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-500/10 dark:file:text-green-400"
                      />
                      {proofFile && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          File dipilih: {proofFile.name}
                        </p>
                      )}
                      <Button
                        onClick={uploadPaymentProof}
                        disabled={!proofFile || uploadingProof}
                        className="w-full mt-4 gap-2"
                        variant="primary"
                      >
                        {uploadingProof ? "Mengupload..." : "Upload Bukti Transfer"}
                      </Button>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
                  Setelah kamu konfirmasi, admin akan memverifikasi pembayaran.
                </p>
              </div>
            )}

           {!isPaid && isBankTransfer && (
             <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
               <h2 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-green-500" />
                 Bayar dengan Transfer Bank
               </h2>
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                 Kirim pembayaran ke rekening bank yang akan ditampilkan saat checkout, lalu upload bukti transfer di bawah ini.
               </p>
               
                {hasProof ? (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bukti Transfer Terupload:</p>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <img src={order.paymentProofUrl!} alt="Bukti Transfer" className="max-w-full h-auto rounded-lg mb-3" />
                      <Button
                        onClick={() => window.open(order.paymentProofUrl!, "_blank")}
                        variant="outline"
                        className="w-full gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Lihat Bukti Transfer
                      </Button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Admin akan memverifikasi pembayaran Anda.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Upload Bukti Transfer (Gambar)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-500/10 dark:file:text-green-400"
                      />
                      {proofFile && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          File dipilih: {proofFile.name}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={uploadPaymentProof}
                      disabled={!proofFile || uploadingProof}
                      className="w-full gap-2"
                      variant="primary"
                    >
                      {uploadingProof ? "Mengupload..." : "Upload Bukti Transfer"}
                    </Button>
                  </div>
                )}
                
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg">
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 text-center">
                    ⚠️ Pesanan akan diproses setelah admin memverifikasi pembayaran Anda.
                  </p>
                </div>
             </div>
           )}

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              {isPickup ? "Informasi Pengambilan" : "Informasi Pengiriman"}
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Nama</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.shippingName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">No. HP</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.shippingPhone}</p>
                </div>
              </div>
              {isPickup ? (
                <div className="flex items-start gap-3">
                  <Store className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Ambil di</p>
                    <p className="font-medium text-gray-900 dark:text-white">TahuBakso Store</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Jl. Merdeka No. 88, Kec. Tahu, Kota Bakso 40231</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Alamat</p>
                    <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress || "Alamat tidak tersedia"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
