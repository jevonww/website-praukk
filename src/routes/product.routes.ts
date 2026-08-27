import { Router } from "express";
import { ProductController } from "@/controllers/product.controller";
import { ProductService } from "@/services/product.service";
import { ProductRepository } from "@/repositories/product.repository";
import { validate } from "@/middlewares/validate.middleware";
import { asyncHandler } from "@/utils/async-handler";
import { validateProductCreate, validateProductUpdate } from "@/validations/product.validation";
import { uploadProduct } from "@/middlewares/product-upload.middleware";

const router = Router();

const controller = new ProductController(new ProductService(new ProductRepository()));

router.get("/", asyncHandler(controller.list));
router.post("/", uploadProduct.single("image"), validate(validateProductCreate), asyncHandler(controller.create));
router.get("/:id", asyncHandler(controller.getById));
router.put("/:id", uploadProduct.single("image"), validate(validateProductUpdate), asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.remove));

export default router;
