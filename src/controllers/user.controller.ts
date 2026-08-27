import type { Request, Response } from "express";
import { UserService } from "@/services/user.service";
import { User } from "@/models/user.model";

export class UserController {
  constructor(private readonly userService: UserService) {}

  list = async (_req: Request, res: Response) => {
    const users = await this.userService.list();
    res.json({ users: users.map((u) => User.fromRecord(u)) });
  };

  create = async (req: Request, res: Response) => {
    const user = await this.userService.create(req.body);
    res.json({ user });
  };

  patchRole = async (req: Request, res: Response) => {
    const id = Number(String(req.params.id));
    const user = await this.userService.patchRole(id, req.body.role);
    res.json({ user });
  };

  updateProfile = async (req: Request, res: Response) => {
    const id = Number(String(req.params.id));
    const { address, phone } = req.body;
    const user = await this.userService.updateProfile(id, { address, phone });
    res.json({ user });
  };

  remove = async (req: Request, res: Response) => {
    const id = Number(String(req.params.id));
    await this.userService.remove(id);
    res.json({ success: true });
  };
}
