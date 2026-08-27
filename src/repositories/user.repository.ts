import type { User as UserRecord } from "@/generated/prisma/client";
import { BaseRepository } from "@/classes/base-repository";
import { ApiError } from "@/classes/api-error";
import { HTTP_STATUS } from "@/constants";
import { prismaErrorCode } from "@/utils/prisma-error";
import type { CreateUserInput } from "@/interfaces";

export class UserRepository extends BaseRepository {
  async findByEmail(email: string): Promise<UserRecord | null> {
    return this.client.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<UserRecord | null> {
    return this.client.user.findUnique({ where: { id } });
  }

  async findAll(): Promise<UserRecord[]> {
    return this.client.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
    });
  }

  async create(data: CreateUserInput & { password: string; role: string }): Promise<UserRecord> {
    return this.client.user.create({ data });
  }

  async updateRole(id: number, role: string): Promise<UserRecord> {
    try {
      return await this.client.user.update({ where: { id }, data: { role } });
    } catch (error) {
      if (prismaErrorCode(error) === "P2025") {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Pengguna tidak ditemukan");
      }
      throw error;
    }
  }

  async updateProfile(id: number, data: { address?: string; phone?: string }): Promise<UserRecord> {
    try {
      return await this.client.user.update({ where: { id }, data });
    } catch (error) {
      if (prismaErrorCode(error) === "P2025") {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Pengguna tidak ditemukan");
      }
      throw error;
    }
  }

  async remove(id: number): Promise<boolean> {
    await this.client.$transaction([
      this.client.order.updateMany({ where: { userId: id }, data: { userId: null } }),
      this.client.user.delete({ where: { id } }),
    ]);
    return true;
  }
}
