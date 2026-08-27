import type { RequestHandler } from "express";
import { HTTP_STATUS } from "@/constants";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ error: "Endpoint tidak ditemukan" });
};
