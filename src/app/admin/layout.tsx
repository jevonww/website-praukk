"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, FolderKanban, LogOut, ShieldCheck, Home } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useUser, useHydrated, notifyAuthChange } from "@/lib/hooks";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUser();
  const hydrated = useHydrated();

  useEffect(() => {
    // Refresh halaman setiap 60 detik (60000 ms)
    const interval = setInterval(() => {
// Removed window.location.reload()

    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hydrated && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [hydrated, user, router]);

  function handleLogout() {
    localStorage.removeItem("user");
    notifyAuthChange();
    router.push("/login");
  }

  if (!user || user.role !== "ADMIN") return null;

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/produk", label: "Produk", icon: Package },
    { href: "/admin/kategori", label: "Kategori", icon: FolderKanban },
    { href: "/admin/pesanan", label: "Pesanan", icon: ShoppingCart },
    { href: "/admin/users", label: "Pengguna", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex">
      <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 hidden lg:flex lg:flex-col">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white block leading-tight">TahuBakso</span>
              <span className="text-xs text-slate-400">Admin Panel</span>
            </div>
          </Link>
        </div>
        <nav className="px-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 mt-auto pt-8">
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <div className="px-4">
              <p className="text-sm text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <div className="flex items-center gap-1 px-2">
              <ThemeToggle className="text-slate-300 hover:bg-slate-800 hover:text-white" />
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm transition-colors"
              >
                <Home className="w-4 h-4" />
                Lihat Toko
              </Link>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 font-medium text-sm w-full transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <span className="font-bold">Admin Panel</span>
          <div className="flex items-center gap-2">
            <ThemeToggle className="text-slate-300 hover:bg-slate-800 hover:text-white" />
            <button onClick={handleLogout} className="text-sm text-red-400">
              Keluar
            </button>
          </div>
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
