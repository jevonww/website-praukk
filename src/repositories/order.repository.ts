import type { Order as OrderRecord } from "@prisma/client";
import { BaseRepository } from "@/classes/base-repository";
import { FULFILLMENT, PAYMENT_METHOD, PAYMENT_STATUS, ORDER_STATUS } from "@/constants";
import type { CreateOrderInput, UpdateOrderInput } from "@/interfaces";

const orderInclude = {
  items: { include: { product: true } },
} as const;

export class OrderRepository extends BaseRepository {
  async create(input: CreateOrderInput, transactionNumber: string): Promise<OrderRecord> {
    const isPickup = input.fulfillment === FULFILLMENT.AMBIL_SENDIRI;
    const method = input.paymentMethod === FULFILLMENT.AMBIL_SENDIRI ? PAYMENT_METHOD.QRIS : input.paymentMethod;

    // Cek apakah userId valid di database, jika tidak set null agar tidak melanggar foreign key constraint
    let validUserId: number | null = null;
    if (input.userId) {
      const userExists = await this.client.user.findUnique({ where: { id: input.userId } });
      if (userExists) validUserId = userExists.id;
    }

    return this.client.order.create({
      data: {
        transactionNumber,
        userId: validUserId,
        shippingName: input.name,
        shippingAddress: isPickup ? null : input.address ?? null,
        shippingPhone: input.phone,
        totalAmount: input.total,
        status: ORDER_STATUS.MENUNGGU,
        fulfillment: isPickup ? FULFILLMENT.AMBIL_SENDIRI : FULFILLMENT.PENGIRIMAN,
        paymentMethod: method,
        paymentStatus: PAYMENT_STATUS.BELUM_DIBAYAR,
        items: {
          create: input.items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: orderInclude,
    });
  }

  async findAll(userId?: number): Promise<OrderRecord[]> {
    return this.client.order.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: "desc" },
      include: orderInclude,
    });
  }

  async findByTransactionNumber(code: string): Promise<OrderRecord | null> {
    return this.client.order.findUnique({
      where: { transactionNumber: code },
      include: orderInclude,
    });
  }

  async update(id: number, data: Partial<Pick<OrderRecord, "status" | "paymentStatus" | "paymentProofUrl">>): Promise<OrderRecord> {
    return this.client.order.update({
      where: { id },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.paymentStatus ? { paymentStatus: data.paymentStatus } : {}),
        ...(data.paymentProofUrl !== undefined ? { paymentProofUrl: data.paymentProofUrl } : {}),
      },
      include: orderInclude,
    });
  }

  async delete(id: number): Promise<void> {
    await this.client.orderItem.deleteMany({
      where: { orderId: id },
    });
    await this.client.order.delete({
      where: { id },
    });
  }

  async findById(id: number): Promise<OrderRecord | null> {
    return this.client.order.findUnique({
      where: { id },
      include: orderInclude,
    });
  }

  async decrementStock(productId: number, quantity: number): Promise<void> {
    await this.client.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } },
    });
  }
}
