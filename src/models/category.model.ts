import type { Category as CategoryRecord } from "@/generated/prisma/client";
import { BaseModel } from "@/classes/base-model";

export class Category extends BaseModel<CategoryRecord> {
  constructor(data: CategoryRecord) {
    super(data);
  }

  static fromRecord(data: CategoryRecord): Category {
    return new Category(data);
  }
}
