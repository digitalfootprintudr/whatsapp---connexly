/*
  Warnings:

  - You are about to drop the column `labels` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- First add new columns as nullable
ALTER TABLE "Contact" ADD COLUMN "company" TEXT;
ALTER TABLE "Contact" ADD COLUMN "email" TEXT;
ALTER TABLE "Contact" ADD COLUMN "firstName" TEXT;
ALTER TABLE "Contact" ADD COLUMN "isOptedOut" BOOLEAN DEFAULT false;
ALTER TABLE "Contact" ADD COLUMN "lastName" TEXT;
ALTER TABLE "Contact" ADD COLUMN "phoneNumber" TEXT;
ALTER TABLE "Contact" ADD COLUMN "tags" TEXT[];

-- Update existing records with default values
UPDATE "Contact" SET 
  "firstName" = COALESCE("name", 'Unknown'),
  "phoneNumber" = COALESCE("phone", '+1234567890'),
  "tags" = COALESCE("labels", ARRAY[]::TEXT[]);

-- Now make required columns NOT NULL
ALTER TABLE "Contact" ALTER COLUMN "firstName" SET NOT NULL;
ALTER TABLE "Contact" ALTER COLUMN "phoneNumber" SET NOT NULL;

-- Drop old columns
ALTER TABLE "Contact" DROP COLUMN "labels";
ALTER TABLE "Contact" DROP COLUMN "name";
ALTER TABLE "Contact" DROP COLUMN "phone";
