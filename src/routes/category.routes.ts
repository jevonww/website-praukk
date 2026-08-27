import { Router } from "express";
import { prisma } from "@/lib/prisma";
import { asyncHandler } from "@/utils/async-handler";
import slugify from "slugify";

const router = Router();

router.get("/", asyncHandler(async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  res.json({ categories });
}));

router.post("/", asyncHandler(async (req, res) => {
  const { name } = req.body;
  const slug = slugify(name, { lower: true });
  const category = await prisma.category.create({ data: { name, slug } });
  res.json({ category });
}));

router.delete("/:id", asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await prisma.category.delete({ where: { id } });
  res.json({ success: true });
}));

export default router;
