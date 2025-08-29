/*
  Warnings:

  - You are about to drop the `ContactGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactsOnGroups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContactGroup" DROP CONSTRAINT "ContactGroup_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "ContactsOnGroups" DROP CONSTRAINT "ContactsOnGroups_contactId_fkey";

-- DropForeignKey
ALTER TABLE "ContactsOnGroups" DROP CONSTRAINT "ContactsOnGroups_groupId_fkey";

-- DropTable
DROP TABLE "ContactGroup";

-- DropTable
DROP TABLE "ContactsOnGroups";
