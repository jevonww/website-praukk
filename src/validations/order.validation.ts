import { ApiError } from "@/classes/api-error";
import { HTTP_STATUS } from "@/constants";
import type { CreateOrderInput, UpdateOrderInput } from "@/interfaces";

export function validateOrderCreate(body: CreateOrderInput) {
  if (
    !Array.isArray(body?.items) ||
    body.items.length === 0 ||
    !body?.name ||
    !body?.phone ||
    body?.total == null
  ) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Semua field wajib diisi");
  }
}

export function validateOrderUpdate(body: UpdateOrderInput) {
  if (body?.id == null) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Field id wajib diisi");
  }
}
