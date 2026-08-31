import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin321", 12);

  await prisma.user.deleteMany({ where: { email: "admin@tahubakso.id" } });

  await prisma.user.upsert({
    where: { email: "admintb" },
    update: {
      name: "Admin Tahu Bakso",
      password: adminPassword,
      role: "ADMIN",
    },
    create: {
      name: "Admin Tahu Bakso",
      email: "admintb",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const categories = [
    { name: "Tahu Bakso", slug: "tahu-bakso", description: "Produk Tahu Bakso Sabrina" },
    { name: "Lumpia", slug: "lumpia", description: "Produk Lumpia Sabrina" },
    { name: "Bakso", slug: "bakso", description: "Produk Bakso Sabrina" },
    { name: "Galantine", slug: "galantine", description: "Produk Galantine Sabrina" },
  ];

  // Hapus semua produk dan kategori yang tidak ada dalam daftar yang diizinkan
  const validCategorySlugs = categories.map((c) => c.slug);
  
  // Hapus produk yang bukan bagian dari kategori valid
  await prisma.product.deleteMany({
    where: {
      category: {
        slug: { notIn: validCategorySlugs },
      },
    },
  });

  // Hapus kategori yang tidak valid
  await prisma.category.deleteMany({
    where: {
      slug: { notIn: validCategorySlugs },
    },
  });

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const products = [
    // Tahu Bakso
    { name: "Tahu Bakso Goreng Ori", slug: "tb-goreng-ori", description: "1 dus isi 10 biji", price: 38000, stock: 50, categorySlug: "tahu-bakso" },
    { name: "Tahu Bakso Goreng Mercon", slug: "tb-goreng-mercon", description: "1 dus isi 10 biji", price: 41000, stock: 50, categorySlug: "tahu-bakso" },
    { name: "Tahu Bakso Goreng Mix", slug: "tb-goreng-mix", description: "1 dus isi 10 biji (5 ori, 5 mercon)", price: 40000, stock: 50, categorySlug: "tahu-bakso" },
    { name: "Tahu Bakso Kukus Ori", slug: "tb-kukus-ori", description: "1 dus isi 10 biji", price: 35000, stock: 50, categorySlug: "tahu-bakso" },
    { name: "Tahu Bakso Kukus Mercon", slug: "tb-kukus-mercon", description: "1 dus isi 10 biji", price: 39000, stock: 50, categorySlug: "tahu-bakso" },
    { name: "Tahu Bakso Kukus Mix", slug: "tb-kukus-mix", description: "1 dus isi 10 biji (5 ori, 5 mercon)", price: 37000, stock: 50, categorySlug: "tahu-bakso" },
    
    // Lumpia
    { name: "Lumpia Besar Ori Goreng (10)", slug: "lumpia-besar-ori-goreng-10", description: "1 dus isi 10 bj", price: 115000, stock: 20, categorySlug: "lumpia" },
    { name: "Lumpia Besar Ori Goreng (5)", slug: "lumpia-besar-ori-goreng-5", description: "1 mika isi 5 bj", price: 65000, stock: 20, categorySlug: "lumpia" },
    { name: "Lumpia Besar Ori Basah (10)", slug: "lumpia-besar-ori-basah-10", description: "1 mika isi 10 bj", price: 110000, stock: 20, categorySlug: "lumpia" },
    { name: "Lumpia Besar Ori Basah (5)", slug: "lumpia-besar-ori-basah-5", description: "1 mika isi 5 bj", price: 62500, stock: 20, categorySlug: "lumpia" },
    { name: "Lumpia Besar Spesial Goreng (10)", slug: "lumpia-besar-spesial-goreng-10", description: "1 besek isi 10 bj", price: 160000, stock: 20, categorySlug: "lumpia" },
    { name: "Lumpia Besar Spesial Goreng (5)", slug: "lumpia-besar-spesial-goreng-5", description: "1 besek isi 5 bj", price: 90000, stock: 20, categorySlug: "lumpia" },
    { name: "Lumpia Besar Spesial Basah (10)", slug: "lumpia-besar-spesial-basah-10", description: "1 besek isi 10 bj", price: 155000, stock: 20, categorySlug: "lumpia" },
    { name: "Lumpia Besar Spesial Basah (5)", slug: "lumpia-besar-spesial-basah-5", description: "1 besek isi 5 bj", price: 85000, stock: 20, categorySlug: "lumpia" },

    // Bakso
    { name: "Bakso Kukus", slug: "bakso-kukus", description: "1 dus isi 30 biji", price: 34000, stock: 30, categorySlug: "bakso" },
    { name: "Bakso Goreng Telur", slug: "bakso-goreng-telur", description: "1 dus isi 30 biji", price: 39000, stock: 30, categorySlug: "bakso" },

    // Galantine
    { name: "Galantine Goreng Telur", slug: "galantine-goreng-telur", description: "1 dus isi 2 lonjor", price: 39000, stock: 30, categorySlug: "galantine" },
    { name: "Galantine Kukus", slug: "galantine-kukus", description: "1 dus isi 2 lonjor", price: 34000, stock: 30, categorySlug: "galantine" },
  ];

  for (const prod of products) {
    const category = await prisma.category.findUnique({
      where: { slug: prod.categorySlug },
    });
    if (!category) continue;

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        stock: prod.stock,
        imageUrl: `/images/products/${prod.slug}.jpg`,
        categoryId: category.id,
      },
    });
  }

  console.log("Seed data berhasil diperbarui!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
