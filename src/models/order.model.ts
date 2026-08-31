import type { Order as OrderRecord } from "@prisma/client";
import { BaseModel } from "@/classes/base-model";

export class Order extends BaseModel<OrderRecord> {
  constructor(data: OrderRecord) {
    super(data);
  }

  static fromRecord(data: OrderRecord): Order {
    return new Order(data);
  }
}
