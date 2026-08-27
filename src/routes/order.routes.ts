import { Router } from "express";
import { OrderController } from "@/controllers/order.controller";
import { OrderService } from "@/services/order.service";
import { OrderRepository } from "@/repositories/order.repository";
import { validate } from "@/middlewares/validate.middleware";
import { asyncHandler } from "@/utils/async-handler";
import { validateOrderCreate, validateOrderUpdate } from "@/validations/order.validation";
import { upload } from "@/middlewares/upload.middleware";

const router = Router();

const controller = new OrderController(new OrderService(new OrderRepository()));

router.post("/", validate(validateOrderCreate), asyncHandler(controller.create));
router.get("/", asyncHandler(controller.list));
router.patch("/", validate(validateOrderUpdate), asyncHandler(controller.update));
router.get("/track", asyncHandler(controller.track));
router.post("/upload-proof", upload.single("paymentProof"), asyncHandler(controller.uploadPaymentProof));
router.post("/verify-payment", asyncHandler(controller.verifyPayment));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
