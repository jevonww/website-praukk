/*
  Warnings:

  - Added the required column `transactionNumber` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "transactionNumber" TEXT NOT NULL,
    "userId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "fulfillment" TEXT NOT NULL DEFAULT 'DELIVERY',
    "paymentMethod" TEXT NOT NULL DEFAULT 'QRIS',
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
    "totalAmount" REAL NOT NULL,
    "shippingName" TEXT NOT NULL,
    "shippingAddress" TEXT,
    "shippingPhone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "id", "shippingAddress", "shippingName", "shippingPhone", "status", "totalAmount", "updatedAt", "userId", "transactionNumber") SELECT "createdAt", "id", "shippingAddress", "shippingName", "shippingPhone", "status", "totalAmount", "updatedAt", "userId", 'TB-' || printf('%06d', "id") FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_transactionNumber_key" ON "Order"("transactionNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
