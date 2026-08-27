import { Router } from "express";
import authRoutes from "@/routes/auth.routes";
import productRoutes from "@/routes/product.routes";
import orderRoutes from "@/routes/order.routes";
import userRoutes from "@/routes/user.routes";
import categoryRoutes from "@/routes/category.routes";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "API TahuBakso" });
});

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);

export default router;
