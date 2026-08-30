import { prisma } from "@/lib/prisma";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const [totalProducts, totalOrders, totalUsers, revenueResult] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: "DIBAYAR" },
    }),
  ]);

  const totalRevenue = revenueResult._sum.totalAmount || 0;

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { items: { include: { product: true } } },
  });

  const stats = [
    { icon: Package, label: "Total Produk", value: totalProducts, color: "bg-blue-500" },
    { icon: ShoppingCart, label: "Total Pesanan", value: totalOrders, color: "bg-green-500" },
    { icon: Users, label: "Pengguna", value: totalUsers, color: "bg-purple-500" },
    { icon: TrendingUp, label: "Pendapatan", value: formatPrice(totalRevenue), color: "bg-green-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
              <div className={`inline-flex p-3 rounded-lg ${stat.color} text-white mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Pesanan Terbaru</h2>
        </div>
        <div className="divide-y dark:divide-gray-800">
          {recentOrders.length === 0 ? (
            <p className="p-6 text-gray-500 dark:text-gray-400 text-sm">Belum ada pesanan</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{order.shippingName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{order.items.length} item</p>
                </div>
                <span className="text-sm font-semibold text-green-500">
                  Rp{order.totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
