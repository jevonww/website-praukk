import { OrderRepository } from "@/repositories/order.repository";
import { ApiError } from "@/classes/api-error";
import { HTTP_STATUS } from "@/constants";
import { generateTransactionNumber } from "@/utils/generate-transaction-number";
import type { CreateOrderInput, UpdateOrderInput } from "@/interfaces";
import type { Order as OrderRecord } from "@prisma/client";

const TRANSACTION_ATTEMPTS = 5;

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async create(input: CreateOrderInput) {
    let transactionNumber = generateTransactionNumber();
    for (let attempt = 0; attempt < TRANSACTION_ATTEMPTS; attempt++) {
      const existing = await this.orderRepository.findByTransactionNumber(transactionNumber);
      if (!existing) break;
      transactionNumber = generateTransactionNumber();
    }

    const order = await this.orderRepository.create(input, transactionNumber);

    for (const item of input.items) {
      await this.orderRepository.decrementStock(item.id, item.quantity);
    }

    return order;
  }

  async list(userId?: number) {
    return this.orderRepository.findAll(userId);
  }

  async update(input: UpdateOrderInput) {
    return this.orderRepository.update(input.id, {
      status: input.status,
      paymentStatus: input.paymentStatus,
    });
  }

  async track(code: string) {
    if (!code) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Kode tidak valid");
    }

    const order = await this.orderRepository.findByTransactionNumber(code);
    if (!order) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Pesanan tidak ditemukan");
    }

    return order;
  }

  async uploadPaymentProof(transactionNumber: string, paymentProofUrl: string) {
    if (!transactionNumber) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Transaction number diperlukan");
    }

    const order = await this.orderRepository.findByTransactionNumber(transactionNumber);
    if (!order) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Pesanan tidak ditemukan");
    }

    const updateData: Partial<OrderRecord> = { paymentProofUrl };

    if (!order.paymentProofUrl && !order.paymentStatus) {
      updateData.paymentStatus = "BELUM_DIBAYAR";
    }

    return this.orderRepository.update(order.id, updateData);
  }

  async verifyPayment(orderId: number, paymentStatus: string) {
    if (!orderId || !paymentStatus) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Data tidak lengkap");
    }

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Pesanan tidak ditemukan");
    }

    let newStatus = order.status;
    
    if (paymentStatus === "DIBAYAR") {
      newStatus = "DIKONFIRMASI";
    }

    return this.orderRepository.update(orderId, {
      paymentStatus,
      status: newStatus,
    });
  }

  async delete(orderId: number) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Pesanan tidak ditemukan");
    }
    return this.orderRepository.delete(orderId);
  }
}
