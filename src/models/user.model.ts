import type { User as UserRecord } from "@prisma/client";
import { BaseModel } from "@/classes/base-model";

export class User extends BaseModel<UserRecord> {
  constructor(data: UserRecord) {
    super(data);
  }

  static fromRecord(data: UserRecord): User {
    return new User(data);
  }
}
