import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  const product = await prisma.product.findUnique({
    where: !isNaN(numericId) ? { id: numericId } : { slug: id },
    include: { category: true },
  });

  if (!product) notFound();

  return <ProductDetailClient product={product} />;

  return <ProductDetailClient product={product} />;
}
