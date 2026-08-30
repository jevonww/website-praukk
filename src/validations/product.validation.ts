import { ApiError } from "@/classes/api-error";
import { HTTP_STATUS } from "@/constants";
import type { CreateProductInput } from "@/interfaces";

export function validateProductCreate(body: any) {
  if (
    !body?.name ||
    !body?.slug ||
    body?.price == null ||
    body?.stock == null ||
    body?.categoryId == null
  ) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Semua field wajib diisi");
  }
}

export function validateProductUpdate(body: any) {
  if (
    !body?.name &&
    !body?.description &&
    body?.price == null &&
    body?.stock == null &&
    body?.categoryId == null &&
    !body?.imageUrl
  ) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Data tidak lengkap");
  }
}
