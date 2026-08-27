"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useUser } from "@/lib/hooks";

export default function UserActions({ id, name, role }: { id: number; name: string; role: string }) {
  const router = useRouter();
  const currentUser = useUser();
  const [loading, setLoading] = useState(false);

  async function handleRoleChange(nextRole: string) {
    setLoading(true);
    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: nextRole }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Gagal mengubah role");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (currentUser?.id === id) {
      alert("Tidak bisa menghapus akun yang sedang dipakai.");
      return;
    }
    if (!confirm(`Hapus pengguna "${name}"?`)) return;
    setLoading(true);
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Gagal menghapus pengguna");
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <select
        value={role}
        disabled={loading || currentUser?.id === id}
        onChange={(e) => handleRoleChange(e.target.value)}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer disabled:opacity-50 ${
          role === "ADMIN"
            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400"
            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        }`}
      >
        <option value="CUSTOMER">Pelanggan</option>
        <option value="ADMIN">Admin</option>
      </select>
      <button
        onClick={handleDelete}
        disabled={loading || currentUser?.id === id}
        title="Hapus pengguna"
        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
