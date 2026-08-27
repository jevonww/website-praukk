import type { Request, Response } from "express";
import { AuthService } from "@/services/auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    const user = await this.authService.login(req.body);
    res.json({ user });
  };

  register = async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    res.json(result);
  };
}
