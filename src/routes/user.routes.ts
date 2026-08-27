import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { UserService } from "@/services/user.service";
import { UserRepository } from "@/repositories/user.repository";
import { validate } from "@/middlewares/validate.middleware";
import { asyncHandler } from "@/utils/async-handler";
import { validateUserCreate, validateUserRole } from "@/validations/user.validation";

const router = Router();

const controller = new UserController(new UserService(new UserRepository()));

router.get("/", asyncHandler(controller.list));
router.post("/", validate(validateUserCreate), asyncHandler(controller.create));
router.patch("/:id/profile", asyncHandler(controller.updateProfile));
router.patch("/:id", validate(validateUserRole), asyncHandler(controller.patchRole));
router.delete("/:id", asyncHandler(controller.remove));

export default router;
