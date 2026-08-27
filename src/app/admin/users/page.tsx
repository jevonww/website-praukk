import { prisma } from "@/lib/prisma";
import { ShoppingBag } from "lucide-react";
import UserActions from "./_components/UserActions";
import AddUserForm from "./_components/AddUserForm";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Pengguna</h1>
        <AddUserForm />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Pengguna</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Pesanan</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Terdaftar</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-600 dark:text-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Belum ada pengguna
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                            u.role === "ADMIN"
                              ? "bg-gradient-to-br from-indigo-500 to-violet-500"
                              : "bg-green-500"
                          }`}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{u.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.role === "ADMIN"
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400"
                            : "bg-red-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                        }`}
                      >
                        {u.role === "ADMIN" ? "Admin" : "Pelanggan"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <ShoppingBag className="w-4 h-4" />
                        {u._count.orders}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {u.createdAt.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <UserActions id={u.id} name={u.name} role={u.role} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
