import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/config/database";

export abstract class BaseRepository {
  protected readonly client: PrismaClient;

  constructor(client: PrismaClient = prisma) {
    this.client = client;
  }
}
