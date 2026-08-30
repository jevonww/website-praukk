"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Store, User, LogOut, ArrowLeft, LogIn, ChevronRight, Shield, MapPin, Phone, Save } from "lucide-react";
import { useUser, useHydrated, notifyAuthChange, AuthUser } from "@/lib/hooks";

export default function ProfilPage() {
  const router = useRouter();
  const user = useUser();
  const hydrated = useHydrated();

  const [form, setForm] = useState({
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated && !user) {
      router.push("/login");
    } else if (user) {
      setForm((prev) => ({
        ...prev,
        address: user.address || "",
        phone: user.phone || "",
      }));
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/users/${user?.id}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        // Update local storage user
        const updatedUser: AuthUser = { ...user, ...data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        notifyAuthChange();
        setSuccess("Profil berhasil diperbarui!");
      } else {
        setError(data.error || "Gagal memperbarui profil");
      }
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  const initial = user.name?.charAt(0).toUpperCase() || "G";
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  function handleLogout() {
    localStorage.removeItem("user");
    notifyAuthChange();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-950 pb-12">
      <div className="max-w-xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-green-500/30 ring-4 ring-white dark:ring-gray-900">
              {initial}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-4 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs">✓</div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 break-all">{user.email}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            {user.role === "ADMIN" ? "Administrator" : "Pelanggan"}
          </div>
        </motion.div>

        {/* Form Alamat & No Telp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/60 dark:shadow-black/20 p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-500" /> Informasi Pengiriman Default
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            Atur alamat dan nomor telepon Anda di sini agar saat checkout nanti data otomatis terisi tanpa perlu mengetik ulang!
          </p>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-gray-400" /> Nomor Telepon / WhatsApp
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Contoh: 081234567890"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400" /> Alamat Lengkap
              </label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
                placeholder="Contoh: Jl. Mawar No. 12 RT 03/04, Kel. Tahu, Kota..."
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-xl">{error}</p>}
            {success && <p className="text-sm text-green-600 bg-green-50 dark:bg-green-500/10 p-3 rounded-xl">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/25"
            >
              <Save className="w-4 h-4" /> {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/60 dark:shadow-black/20 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden mb-4"
        >
          <MenuRow
            href="/pesanan"
            icon={<Package className="w-5 h-5" />}
            iconClass="bg-green-50 text-green-500 dark:bg-green-500/10"
            label="Pesanan Saya"
          />
          <MenuRow
            href="/lacak"
            icon={<Store className="w-5 h-5" />}
            iconClass="bg-blue-50 text-blue-500 dark:bg-blue-500/10"
            label="Lacak Pesanan"
          />
          {user.role === "ADMIN" && (
            <MenuRow
              href="/admin"
              icon={<User className="w-5 h-5" />}
              iconClass="bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10"
              label="Panel Admin"
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/60 dark:shadow-black/20 overflow-hidden"
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-4 text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </motion.div>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          Terdaftar sejak {joinDate}
        </p>
      </div>
    </div>
  );
}

interface MenuRowProps {
  href: string;
  icon: React.ReactNode;
  iconClass: string;
  label: string;
}

function MenuRow({ href, icon, iconClass, label }: MenuRowProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors group"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}>
        {icon}
      </div>
      <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-green-500 transition-colors" />
    </Link>
  );
}
