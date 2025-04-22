/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Analysis` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_publicId_key" ON "Analysis"("publicId");

-- CreateIndex
CREATE INDEX "Analysis_publicId_idx" ON "Analysis"("publicId");
