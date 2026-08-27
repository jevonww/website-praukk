import "dotenv/config";

export const config = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL || "file:./dev.db",
  apiUrl: process.env.API_URL || "http://localhost:4000",
  nodeEnv: process.env.NODE_ENV || "development",
};
