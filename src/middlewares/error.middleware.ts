import type { ErrorRequestHandler } from "express";
import { ApiError } from "@/classes/api-error";
import { HTTP_STATUS } from "@/constants";

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  console.error(err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  return res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ error: err.message || "Terjadi kesalahan" });
};
