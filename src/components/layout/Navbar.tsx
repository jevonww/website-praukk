"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, syncCartOwner } from "@/store/cart";
import {
  ShoppingCart,
  Menu,
  X,
  Store,
  LogIn,
  ChevronDown,
  User,
  Package,
  LogOut,
  Shield,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useHydrated, useUser, notifyAuthChange } from "@/lib/hooks";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isMounted = useHydrated();
  const user = useUser();
  const totalItems = useCart((s) => s.totalItems());

  useEffect(() => {
    syncCartOwner(user?.id ?? null);
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { href: "/", label: "Beranda" },
    { href: "/produk", label: "Produk" },
    { href: "/lacak", label: "Lacak Pesanan" },
  ];

  function handleLogout() {
    localStorage.removeItem("user");
    notifyAuthChange();
    setIsDropdownOpen(false);
    setIsOpen(false);
    router.push("/");
  }

  const initial = user?.name?.charAt(0).toUpperCase() || "G";
  const isAdmin = user?.role === "ADMIN";
  const avatarClass = isAdmin
    ? "bg-gradient-to-br from-indigo-500 to-violet-500"
    : "bg-[#22c55e]";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-9 h-9 bg-[#22c55e] rounded-lg flex items-center justify-center"
            >
              <Store className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              Tahu<span className="text-[#22c55e]">Bakso</span> Sabrina
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-[#22c55e] dark:hover:text-[#4ade80] font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/keranjang"
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-[#22c55e] dark:hover:text-[#4ade80] transition-colors"
              aria-label="Keranjang"
            >
              <ShoppingCart className="w-6 h-6" />
              {isMounted && totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                   className="absolute -top-1 -right-1 bg-[#22c55e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {isMounted && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:border-[#4ade80] hover:shadow-sm transition-all"
                >
                  <span className={`w-8 h-8 rounded-full ${avatarClass} text-white flex items-center justify-center font-bold text-sm`}>
                    {initial}
                  </span>
                  <span className="hidden sm:block text-sm font-medium text-gray-800 dark:text-gray-200 max-w-[8rem] truncate">
                    {user.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        {user.role === "ADMIN" && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profil"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          Profil Saya
                        </Link>
                        <Link
                          href="/pesanan"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <Package className="w-4 h-4 text-gray-400" />
                          Pesanan Saya
                        </Link>
                        {user.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <Store className="w-4 h-4" />
                            Panel Admin
                          </Link>
                        )}
                      </div>
                      <div className="py-1 border-t border-gray-100 dark:border-gray-800">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <LogOut className="w-4 h-4" />
                          Keluar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#22c55e] text-white rounded-lg hover:bg-[#16a34a] transition-colors text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                Masuk
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
              aria-label="Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMounted && isAdmin && (
        <div className="bg-indigo-600 dark:bg-indigo-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11 gap-3">
            <span className="flex items-center gap-1.5 text-indigo-100 text-xs sm:text-sm font-semibold shrink-0">
              <Shield className="w-4 h-4" />
              Mode Admin
            </span>
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
              <Link
                href="/admin/produk/tambah"
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs sm:text-sm font-medium text-white bg-indigo-500/60 hover:bg-indigo-500 transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Produk
              </Link>
              <Link
                href="/admin/produk"
                className="px-2.5 py-1 rounded-md text-xs sm:text-sm font-medium text-indigo-100 hover:bg-indigo-500 transition-colors shrink-0"
              >
                Kelola Produk
              </Link>
              <Link
                href="/admin/pesanan"
                className="px-2.5 py-1 rounded-md text-xs sm:text-sm font-medium text-indigo-100 hover:bg-indigo-500 transition-colors shrink-0"
              >
                Kelola Pesanan
              </Link>
              <Link
                href="/admin/users"
                className="px-2.5 py-1 rounded-md text-xs sm:text-sm font-medium text-indigo-100 hover:bg-indigo-500 transition-colors shrink-0"
              >
                Kelola Pengguna
              </Link>
              <Link
                href="/admin"
                className="px-2.5 py-1 rounded-md text-xs sm:text-sm font-medium text-white bg-white/15 hover:bg-white/25 transition-colors shrink-0"
              >
                Panel Admin
              </Link>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {isMounted && user && (
                <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/60">
                  <span className={`w-10 h-10 rounded-full ${avatarClass} text-white flex items-center justify-center font-bold`}>
                    {initial}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
              )}
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                   className="block py-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 font-medium"
                >
                  {link.label}
                </Link>
              ))}
              {isMounted && user ? (
                <>
                  <Link
                    href="/pesanan"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 font-medium"
                  >
                    <Package className="w-5 h-5" />
                    Pesanan Saya
                  </Link>
                  <Link
                    href="/profil"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 font-medium"
                  >
                    <User className="w-5 h-5" />
                    Profil Saya
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 py-2 text-indigo-600 dark:text-indigo-400 font-medium"
                    >
                      <Store className="w-5 h-5" />
                      Panel Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg justify-center font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                   className="flex items-center gap-2 w-full px-4 py-2 bg-[#22c55e] text-white rounded-lg justify-center"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
