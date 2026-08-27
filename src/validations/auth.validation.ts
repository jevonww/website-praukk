import { ApiError } from "@/classes/api-error";
import { HTTP_STATUS } from "@/constants";
import type { LoginInput, RegisterInput } from "@/interfaces";

export function validateLogin(body: LoginInput) {
  if (!body?.email || !body?.password) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Email dan password wajib diisi");
  }
}

export function validateRegister(body: RegisterInput) {
  if (!body?.name || !body?.email || !body?.password) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Nama, email, dan password wajib diisi");
  }
}
