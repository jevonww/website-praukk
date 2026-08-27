import Hero from "@/components/landing/Hero";
import ProductCard from "@/components/produk/ProductCard";
import { prisma } from "@/lib/prisma";
import { Sparkles, Award, Truck, Headphones } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Sparkles, title: "Bahan Segar", desc: "100% bahan segar tanpa pengawet" },
  { icon: Award, title: "Resep Ibu Ani", desc: "Resep khas Jl. Gergaji Semarang" },
  { icon: Truck, title: "Pengiriman", desc: "Tahan hingga 2 hari di luar kulkas" },
  { icon: Headphones, title: "Pemesanan", desc: "Diusahakan tidak mendadak" },
];

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <>
      <Hero />

      <section id="featured" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="text-center p-6 rounded-2xl bg-red-50 dark:bg-green-500/10 hover:bg-red-100 dark:hover:bg-green-500/20 transition-colors"
                >
                  <div className="inline-flex p-3 bg-green-500 text-white rounded-xl mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Produk Terbaru</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Tahu Bakso Sabrina: Fresh, Kenyal, Halal & Higienis.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                imageUrl={p.imageUrl}
                stock={p.stock}
                slug={p.slug}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Nikmati Tahu Bakso?
          </h2>
          <p className="text-green-100 mb-8 text-lg">
            Pesan sekarang dan nikmati kelezatan tahu bakso fresh di rumahmu!
          </p>
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-green-500 rounded-full font-bold hover:bg-red-50 transition-colors shadow-lg"
          >
            Pesan Sekarang
          </Link>
        </div>
      </section>
    </>
  );
}
