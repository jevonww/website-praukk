"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, UserPlus } from "lucide-react";

export default function AddUserForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CUSTOMER" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || "Gagal menambah pengguna");
      setLoading(false);
      return;
    }

    setForm({ name: "", email: "", password: "", role: "CUSTOMER" });
    setOpen(false);
    router.refresh();
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
      >
        {open ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        {open ? "Tutup" : "Tambah Pengguna"}
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 max-w-2xl bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
            <UserPlus className="w-5 h-5 text-indigo-500" />
            Tambah Pengguna Baru
          </div>
          <div>
            <label className={labelClass}>Nama</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="Nama lengkap"
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
              placeholder="email@contoh.com"
            />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass}
              placeholder="Minimal 6 karakter"
            />
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={inputClass}
            >
              <option value="CUSTOMER">Pelanggan</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Pengguna"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
