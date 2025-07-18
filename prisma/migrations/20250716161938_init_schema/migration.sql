/*
  Warnings:

  - You are about to alter the column `phone` on the `employee` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to drop the column `agency` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `companyPrice` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `m1` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `m2` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `m3` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `payment` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `v1` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `v2` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the `employeegroup` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[reservationId]` on the table `Transfer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorizedId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menuId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentType` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ship` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voucherNo` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saloonId` to the `ResTable` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_groupId_fkey`;

-- DropIndex
DROP INDEX `Employee_groupId_fkey` ON `employee`;

-- DropIndex
DROP INDEX `Employee_username_key` ON `employee`;

-- AlterTable
ALTER TABLE `employee` MODIFY `phone` INTEGER NOT NULL,
    MODIFY `password` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `agency`,
    DROP COLUMN `companyPrice`,
    DROP COLUMN `m1`,
    DROP COLUMN `m2`,
    DROP COLUMN `m3`,
    DROP COLUMN `name`,
    DROP COLUMN `payment`,
    DROP COLUMN `price`,
    DROP COLUMN `total`,
    DROP COLUMN `v1`,
    DROP COLUMN `v2`,
    ADD COLUMN `arrivalTransferId` VARCHAR(191) NULL,
    ADD COLUMN `authorizedId` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `menuId` VARCHAR(191) NOT NULL,
    ADD COLUMN `nationality` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentType` VARCHAR(191) NOT NULL,
    ADD COLUMN `returnTransferId` VARCHAR(191) NULL,
    ADD COLUMN `saloonId` VARCHAR(191) NULL,
    ADD COLUMN `ship` VARCHAR(191) NOT NULL,
    ADD COLUMN `transferNote` VARCHAR(191) NULL,
    ADD COLUMN `voucherNo` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `restable` ADD COLUMN `saloonId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `employeegroup`;

-- CreateTable
CREATE TABLE `employee_groups` (
    `id` VARCHAR(191) NOT NULL,
    `groupName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `supplierType` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `tax` VARCHAR(191) NULL,
    `limit` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NOT NULL,
    `lastUpdate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanyRate` (
    `id` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `m1` DOUBLE NOT NULL,
    `m2` DOUBLE NOT NULL,
    `m3` DOUBLE NOT NULL,
    `v1` DOUBLE NOT NULL,
    `v2` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExpenseGroup` (
    `id` VARCHAR(191) NOT NULL,
    `expenseGroupName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `id` VARCHAR(191) NOT NULL,
    `expenseGroupId` VARCHAR(191) NOT NULL,
    `expenseName` VARCHAR(191) NOT NULL,
    `ship` BOOLEAN NOT NULL,
    `accountant` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GeneralIncome` (
    `id` VARCHAR(191) NOT NULL,
    `menuName` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `flierPrice` DOUBLE NOT NULL,
    `otelPrice` DOUBLE NOT NULL,
    `fiveAndFarPrice` DOUBLE NOT NULL,
    `agencyPrice` DOUBLE NOT NULL,
    `guidePrice` DOUBLE NOT NULL,
    `individualPrice` DOUBLE NOT NULL,
    `companyPrice` DOUBLE NOT NULL,
    `onlinePrice` DOUBLE NOT NULL,
    `othersPrice` DOUBLE NOT NULL,
    `startedAt` DATETIME(3) NOT NULL,
    `endedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Income` (
    `incomeId` VARCHAR(191) NOT NULL,
    `incomeName` VARCHAR(191) NOT NULL,
    `incomeTax` DOUBLE NOT NULL,
    `ship` BOOLEAN NOT NULL,
    `accountant` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`incomeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LocationIncome` (
    `id` VARCHAR(191) NOT NULL,
    `menuName` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `flierPrice` DOUBLE NOT NULL,
    `otelPrice` DOUBLE NOT NULL,
    `fiveAndFarPrice` DOUBLE NOT NULL,
    `agencyPrice` DOUBLE NOT NULL,
    `guidePrice` DOUBLE NOT NULL,
    `individualPrice` DOUBLE NOT NULL,
    `companyPrice` DOUBLE NOT NULL,
    `onlinePrice` DOUBLE NOT NULL,
    `othersPrice` DOUBLE NOT NULL,
    `startedAt` DATETIME(3) NOT NULL,
    `endedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubIncome` (
    `id` VARCHAR(191) NOT NULL,
    `menuName` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `flierPrice` DOUBLE NOT NULL,
    `otelPrice` DOUBLE NOT NULL,
    `fiveAndFarPrice` DOUBLE NOT NULL,
    `agencyPrice` DOUBLE NOT NULL,
    `guidePrice` DOUBLE NOT NULL,
    `individualPrice` DOUBLE NOT NULL,
    `companyPrice` DOUBLE NOT NULL,
    `onlinePrice` DOUBLE NOT NULL,
    `othersPrice` DOUBLE NOT NULL,
    `startedAt` DATETIME(3) NOT NULL,
    `endedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Saloon` (
    `id` VARCHAR(191) NOT NULL,
    `ship` VARCHAR(191) NOT NULL,
    `saloonName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Transfer_reservationId_key` ON `Transfer`(`reservationId`);

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `employee_groups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_expenseGroupId_fkey` FOREIGN KEY (`expenseGroupId`) REFERENCES `ExpenseGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResTable` ADD CONSTRAINT `ResTable_saloonId_fkey` FOREIGN KEY (`saloonId`) REFERENCES `Saloon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_authorizedId_fkey` FOREIGN KEY (`authorizedId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_arrivalTransferId_fkey` FOREIGN KEY (`arrivalTransferId`) REFERENCES `TransferPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_returnTransferId_fkey` FOREIGN KEY (`returnTransferId`) REFERENCES `TransferPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_saloonId_fkey` FOREIGN KEY (`saloonId`) REFERENCES `Saloon`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `CompanyRate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
