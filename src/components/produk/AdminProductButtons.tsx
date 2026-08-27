"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";

export default function AdminProductButtons({ id, name }: { id: number; name: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Hapus produk "${name}"?`)) return;
    setDeleting(true);
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Gagal menghapus produk");
    }
    setDeleting(false);
  }

  const iconClass =
    "bg-white dark:bg-gray-800 shadow rounded-full p-1.5 text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors disabled:opacity-50";

  return (
    <div className="flex items-center gap-1.5">
      <Link href={`/admin/produk/${id}/edit`} title="Edit produk" className={iconClass}>
        <Edit className="w-4 h-4" />
      </Link>
      <button onClick={handleDelete} disabled={deleting} title="Hapus produk" className={iconClass}>
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
