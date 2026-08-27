import bcrypt from "bcryptjs";
import { UserRepository } from "@/repositories/user.repository";
import { ApiError } from "@/classes/api-error";
import { HTTP_STATUS, ROLES } from "@/constants";
import type { LoginInput, RegisterInput } from "@/interfaces";

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async login(input: LoginInput) {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Email tidak terdaftar");
    }

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Password salah");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async register(input: RegisterInput) {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Email sudah terdaftar");
    }

    const hashed = await bcrypt.hash(input.password, 12);
    await this.userRepository.create({
      name: input.name,
      email: input.email,
      password: hashed,
      role: ROLES.CUSTOMER,
    });

    return { success: true };
  }
}
