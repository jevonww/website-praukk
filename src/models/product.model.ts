import type { Product as ProductRecord } from "@/generated/prisma/client";
import { BaseModel } from "@/classes/base-model";

export class Product extends BaseModel<ProductRecord> {
  constructor(data: ProductRecord) {
    super(data);
  }

  static fromRecord(data: ProductRecord): Product {
    return new Product(data);
  }
}
