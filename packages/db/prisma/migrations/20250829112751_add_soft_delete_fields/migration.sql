-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ContactGroup" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
