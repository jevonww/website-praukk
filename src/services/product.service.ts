import { ProductRepository } from "@/repositories/product.repository";
import { ApiError } from "@/classes/api-error";
import { HTTP_STATUS } from "@/constants";
import type { CreateProductInput, UpdateProductInput } from "@/interfaces";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(input: CreateProductInput) {
    // @ts-ignore
    return this.productRepository.create(input);
  }

  async list() {
    return this.productRepository.findAll();
  }

  async getById(id: number) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Produk tidak ditemukan");
    }
    return product;
  }

  async update(id: number, input: UpdateProductInput) {
    // @ts-ignore
    return this.productRepository.update(id, input);
  }

  async remove(id: number) {
    return this.productRepository.remove(id);
  }
}
