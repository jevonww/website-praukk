import bcrypt from "bcryptjs";
import { UserRepository } from "@/repositories/user.repository";
import { ApiError } from "@/classes/api-error";
import { HTTP_STATUS, ROLES } from "@/constants";
import type { CreateUserInput } from "@/interfaces";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async list() {
    return this.userRepository.findAll();
  }

  async create(input: CreateUserInput) {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Email sudah terdaftar");
    }

    const hashed = await bcrypt.hash(input.password, 12);
    return this.userRepository.create({
      name: input.name,
      email: input.email,
      password: hashed,
      role: input.role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.CUSTOMER,
    });
  }

  async patchRole(id: number, role: string) {
    return this.userRepository.updateRole(id, role);
  }

  async updateProfile(id: number, data: { address?: string; phone?: string }) {
    return this.userRepository.updateProfile(id, data);
  }

  async remove(id: number) {
    return this.userRepository.remove(id);
  }
}
