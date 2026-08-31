import type { Product as ProductRecord } from "@prisma/client";
import { BaseRepository } from "@/classes/base-repository";
import { ApiError } from "@/classes/api-error";
import { HTTP_STATUS } from "@/constants";
import { prismaErrorCode } from "@/utils/prisma-error";
import type { CreateProductInput, UpdateProductInput } from "@/interfaces";

export class ProductRepository extends BaseRepository {
  async findAll(): Promise<ProductRecord[]> {
    return this.client.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
  }

  async findById(id: number): Promise<ProductRecord | null> {
    return this.client.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async create(data: CreateProductInput): Promise<ProductRecord> {
    return this.client.product.create({ data });
  }

  async update(id: number, data: UpdateProductInput): Promise<ProductRecord> {
    try {
      return await this.client.product.update({ where: { id }, data });
    } catch (error) {
      if (prismaErrorCode(error) === "P2025") {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Produk tidak ditemukan");
      }
      throw error;
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.client.product.delete({ where: { id } });
      return true;
    } catch (error) {
      const code = prismaErrorCode(error);
      if (code === "P2025") {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "Produk tidak ditemukan");
      }
      if (code === "P2003") {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          "Produk tidak bisa dihapus karena sudah ada di pesanan"
        );
      }
      throw error;
    }
  }
}
