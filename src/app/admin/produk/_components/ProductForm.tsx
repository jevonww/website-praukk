"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import slugify from "slugify";

export interface ProductFormData {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
}

interface ProductFormProps {
  initial?: ProductFormData;
  categories: { id: number; name: string }[];
  mode: "create" | "edit";
}

export default function ProductForm({ initial, categories, mode }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial ? String(initial.price) : "",
    stock: initial ? String(initial.stock) : "",
    categoryId: initial ? String(initial.categoryId) : "",
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("categoryId", form.categoryId);
    formData.append("slug", slugify(form.name, { lower: true }));
    if (form.image) {
      formData.append("image", form.image);
    }

    const res = await fetch(mode === "edit" ? `/api/products/${initial!.id}` : "/api/products", {
      method: mode === "edit" ? "PUT" : "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/admin/produk");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Gagal menyimpan produk");
    }
    setLoading(false);
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="max-w-2xl bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm space-y-4"
    >
      <div>
        <label className={labelClass}>Nama Produk</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Deskripsi</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputClass}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Harga</label>
          <input
            type="number"
            required
            min={0}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Stok</label>
          <input
            type="number"
            required
            min={0}
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Kategori</label>
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className={inputClass}
          >
            <option value="">Pilih</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Gambar Produk</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files?.[0] ?? null })}
          className={inputClass}
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500">
        {loading ? "Menyimpan..." : mode === "edit" ? "Simpan Perubahan" : "Simpan Produk"}
      </Button>
    </motion.form>
  );
}
