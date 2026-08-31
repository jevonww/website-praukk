import type { Request, Response } from "express";
import { OrderService } from "@/services/order.service";
import { Order } from "@/models/order.model";
import { Order as OrderRecord } from "@prisma/client";

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  create = async (req: Request, res: Response) => {
    const order = await this.orderService.create(req.body);
    res.json({ order: Order.fromRecord(order) });
  };

  list = async (req: Request, res: Response) => {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const orders = await this.orderService.list(userId);
    res.json({ orders: orders.map((o) => Order.fromRecord(o)) });
  };

  update = async (req: Request, res: Response) => {
    const order = await this.orderService.update(req.body);
    res.json({ order: Order.fromRecord(order) });
  };

  track = async (req: Request, res: Response) => {
    const code = String(req.query.code || "").trim().toUpperCase();
    const order = await this.orderService.track(code);
    res.json({ order: Order.fromRecord(order) });
  };

  uploadPaymentProof = async (req: Request, res: Response) => {
    try {
      const { transactionNumber } = req.body;
      const file = req.file;
      
      if (!transactionNumber) {
        return res.status(400).json({ error: "Transaction number diperlukan" });
      }
      
      if (!file) {
        return res.status(400).json({ error: "File gambar diperlukan" });
      }

      const paymentProofUrl = (file as any).path;
      const order = await this.orderService.uploadPaymentProof(transactionNumber, paymentProofUrl);
      res.json({ order: Order.fromRecord(order) });
    } catch (error: any) {
      console.error("Upload payment proof error:", error);
      res.status(500).json({ error: error.message || "Gagal upload bukti transfer" });
    }
  };

  verifyPayment = async (req: Request, res: Response) => {
    const { id, paymentStatus } = req.body;
    const order = await this.orderService.verifyPayment(id, paymentStatus);
    res.json({ order: Order.fromRecord(order) });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.orderService.delete(Number(id));
    res.json({ success: true });
  };
}
