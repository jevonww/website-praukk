"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, FolderKanban } from "lucide-react";
import { motion } from "framer-motion";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminKategoriPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categories || []);
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setName("");
      fetchCategories();
    }
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchCategories();
    } else {
      alert("Gagal menghapus kategori (mungkin masih ada produk yang menggunakan kategori ini)");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Kelola Kategori</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm h-fit">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-500" /> Tambah Kategori Baru
          </h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Kategori</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Minuman, Snack, dll"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors text-sm"
            >
              {loading ? "Menambahkan..." : "Tambah Kategori"}
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-500" /> Daftar Kategori ({categories.length})
          </h2>

          <div className="divide-y dark:divide-gray-800">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{cat.name}</p>
                  <p className="text-xs text-gray-400 font-mono">slug: {cat.slug}</p>
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Hapus Kategori"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
