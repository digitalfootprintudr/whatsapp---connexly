/*
  Warnings:

  - Added the required column `message` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stats` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetAudience` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('BULK_MESSAGE', 'TEMPLATE_MESSAGE', 'BOT_FLOW');

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "description" TEXT,
ADD COLUMN     "message" JSONB NOT NULL,
ADD COLUMN     "schedule" JSONB NOT NULL,
ADD COLUMN     "stats" JSONB NOT NULL,
ADD COLUMN     "targetAudience" JSONB NOT NULL,
ADD COLUMN     "type" "CampaignType" NOT NULL DEFAULT 'BULK_MESSAGE';
