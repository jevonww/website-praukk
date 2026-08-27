import { ApiError } from "@/classes/api-error";
import { HTTP_STATUS, ROLES } from "@/constants";
import type { CreateUserInput, UpdateUserRoleInput } from "@/interfaces";

export function validateUserCreate(body: CreateUserInput) {
  if (!body?.name || !body?.email || !body?.password) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Semua field wajib diisi");
  }
}

export function validateUserRole(body: UpdateUserRoleInput) {
  const validRoles = [ROLES.CUSTOMER, ROLES.ADMIN] as string[];
  if (!body?.role || !validRoles.includes(body.role)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Role tidak valid");
  }
}
