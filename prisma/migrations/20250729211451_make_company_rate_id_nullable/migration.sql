/*
  Warnings:

  - A unique constraint covering the columns `[companyRateId]` on the table `company_debts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `company_debts` ADD COLUMN `companyRateId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `company_debts_companyRateId_key` ON `company_debts`(`companyRateId`);
