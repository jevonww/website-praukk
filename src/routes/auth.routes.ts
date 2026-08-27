import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { AuthService } from "@/services/auth.service";
import { UserRepository } from "@/repositories/user.repository";
import { validate } from "@/middlewares/validate.middleware";
import { asyncHandler } from "@/utils/async-handler";
import { validateLogin, validateRegister } from "@/validations/auth.validation";

const router = Router();

const controller = new AuthController(new AuthService(new UserRepository()));

router.post("/login", validate(validateLogin), asyncHandler(controller.login));
router.post("/register", validate(validateRegister), asyncHandler(controller.register));

export default router;
