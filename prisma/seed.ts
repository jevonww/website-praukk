// eslint-disable-next-line @typescript-eslint/no-unused-vars
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL tidak ditemukan di file .env");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Mulai menjalankan seed...");

  const adminPassword = await bcrypt.hash("admin321", 12);

  // =========================
  // ADMIN
  // =========================

  await prisma.user.deleteMany({
    where: {
      email: "admintb",
    },
  });

  await prisma.user.upsert({
    where: {
      email: "admintb",
    },
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

  console.log("Admin berhasil dibuat.");

  // =========================
  // CATEGORIES
  // =========================

  const categories = [
    {
      name: "Tahu Bakso",
      slug: "tahu-bakso",
      description: "Produk Tahu Bakso Sabrina",
    },
    {
      name: "Lumpia",
      slug: "lumpia",
      description: "Produk Lumpia Sabrina",
    },
    {
      name: "Bakso",
      slug: "bakso",
      description: "Produk Bakso Sabrina",
    },
    {
      name: "Galantine",
      slug: "galantine",
      description: "Produk Galantine Sabrina",
    },
  ];

  const validCategorySlugs = categories.map(
    (category) => category.slug
  );

  // =========================
  // DELETE INVALID PRODUCTS
  // =========================

  await prisma.product.deleteMany({
    where: {
      category: {
        slug: {
          notIn: validCategorySlugs,
        },
      },
    },
  });

  // =========================
  // DELETE INVALID CATEGORIES
  // =========================

  await prisma.category.deleteMany({
    where: {
      slug: {
        notIn: validCategorySlugs,
      },
    },
  });

  // =========================
  // CREATE / UPDATE CATEGORIES
  // =========================

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });
  }

  console.log("Kategori berhasil diperbarui.");

  // =========================
  // PRODUCTS
  // =========================

  const products = [
    // Tahu Bakso
    {
      name: "Tahu Bakso Goreng Ori",
      slug: "tb-goreng-ori",
      description: "1 dus isi 10 biji",
      price: 38000,
      stock: 50,
      categorySlug: "tahu-bakso",
    },
    {
      name: "Tahu Bakso Goreng Mercon",
      slug: "tb-goreng-mercon",
      description: "1 dus isi 10 biji",
      price: 41000,
      stock: 50,
      categorySlug: "tahu-bakso",
    },
    {
      name: "Tahu Bakso Goreng Mix",
      slug: "tb-goreng-mix",
      description: "1 dus isi 10 biji (5 ori, 5 mercon)",
      price: 40000,
      stock: 50,
      categorySlug: "tahu-bakso",
    },
    {
      name: "Tahu Bakso Kukus Ori",
      slug: "tb-kukus-ori",
      description: "1 dus isi 10 biji",
      price: 35000,
      stock: 50,
      categorySlug: "tahu-bakso",
    },
    {
      name: "Tahu Bakso Kukus Mercon",
      slug: "tb-kukus-mercon",
      description: "1 dus isi 10 biji",
      price: 39000,
      stock: 50,
      categorySlug: "tahu-bakso",
    },
    {
      name: "Tahu Bakso Kukus Mix",
      slug: "tb-kukus-mix",
      description: "1 dus isi 10 biji (5 ori, 5 mercon)",
      price: 37000,
      stock: 50,
      categorySlug: "tahu-bakso",
    },

    // Lumpia
    {
      name: "Lumpia Besar Ori Goreng (10)",
      slug: "lumpia-besar-ori-goreng-10",
      description: "1 dus isi 10 bj",
      price: 115000,
      stock: 20,
      categorySlug: "lumpia",
    },
    {
      name: "Lumpia Besar Ori Goreng (5)",
      slug: "lumpia-besar-ori-goreng-5",
      description: "1 mika isi 5 bj",
      price: 65000,
      stock: 20,
      categorySlug: "lumpia",
    },
    {
      name: "Lumpia Besar Ori Basah (10)",
      slug: "lumpia-besar-ori-basah-10",
      description: "1 mika isi 10 bj",
      price: 110000,
      stock: 20,
      categorySlug: "lumpia",
    },
    {
      name: "Lumpia Besar Ori Basah (5)",
      slug: "lumpia-besar-ori-basah-5",
      description: "1 mika isi 5 bj",
      price: 62500,
      stock: 20,
      categorySlug: "lumpia",
    },
    {
      name: "Lumpia Besar Spesial Goreng (10)",
      slug: "lumpia-besar-spesial-goreng-10",
      description: "1 besek isi 10 bj",
      price: 160000,
      stock: 20,
      categorySlug: "lumpia",
    },
    {
      name: "Lumpia Besar Spesial Goreng (5)",
      slug: "lumpia-besar-spesial-goreng-5",
      description: "1 besek isi 5 bj",
      price: 90000,
      stock: 20,
      categorySlug: "lumpia",
    },
    {
      name: "Lumpia Besar Spesial Basah (10)",
      slug: "lumpia-besar-spesial-basah-10",
      description: "1 besek isi 10 bj",
      price: 155000,
      stock: 20,
      categorySlug: "lumpia",
    },
    {
      name: "Lumpia Besar Spesial Basah (5)",
      slug: "lumpia-besar-spesial-basah-5",
      description: "1 besek isi 5 bj",
      price: 85000,
      stock: 20,
      categorySlug: "lumpia",
    },

    // Bakso
    {
      name: "Bakso Kukus",
      slug: "bakso-kukus",
      description: "1 dus isi 30 biji",
      price: 34000,
      stock: 30,
      categorySlug: "bakso",
    },
    {
      name: "Bakso Goreng Telur",
      slug: "bakso-goreng-telur",
      description: "1 dus isi 30 biji",
      price: 39000,
      stock: 30,
      categorySlug: "bakso",
    },

    // Galantine
    {
      name: "Galantine Goreng Telur",
      slug: "galantine-goreng-telur",
      description: "1 dus isi 2 lonjor",
      price: 39000,
      stock: 30,
      categorySlug: "galantine",
    },
    {
      name: "Galantine Kukus",
      slug: "galantine-kukus",
      description: "1 dus isi 2 lonjor",
      price: 34000,
      stock: 30,
      categorySlug: "galantine",
    },
  ];

  // =========================
  // CREATE / UPDATE PRODUCTS
  // =========================

  for (const product of products) {
    const category = await prisma.category.findUnique({
      where: {
        slug: product.categorySlug,
      },
    });

    if (!category) {
      console.log(
        `Kategori tidak ditemukan: ${product.categorySlug}`
      );
      continue;
    }

    await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: `https://res.cloudinary.com/dqj6aay3h/image/upload/v1739501509/${product.slug}.jpg`,
        categoryId: category.id,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: `https://res.cloudinary.com/dqj6aay3h/image/upload/v1739501509/${product.slug}.jpg`,
        categoryId: category.id,
      },
    });
  }

  console.log("Produk berhasil diperbarui.");
  console.log("Seed data berhasil diperbarui!");
}

main()
  .catch((error) => {
    console.error("Seed gagal:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
