/*
  Warnings:

  - The primary key for the `income` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `incomeId` on the `income` table. All the data in the column will be lost.
  - You are about to drop the column `incomeName` on the `income` table. All the data in the column will be lost.
  - You are about to drop the column `incomeTax` on the `income` table. All the data in the column will be lost.
  - The required column `id` was added to the `Income` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `Income` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `income` DROP PRIMARY KEY,
    DROP COLUMN `incomeId`,
    DROP COLUMN `incomeName`,
    DROP COLUMN `incomeTax`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `tax` DOUBLE NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `companyDebtId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `company_debts` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `companyType` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `tax` DOUBLE NOT NULL DEFAULT 0,
    `debt` DOUBLE NOT NULL DEFAULT 0,
    `credit` DOUBLE NOT NULL DEFAULT 0,
    `balance` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_companyDebtId_fkey` FOREIGN KEY (`companyDebtId`) REFERENCES `company_debts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
