/*
  Warnings:

  - You are about to drop the column `arrivalTransferId` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `fromWhoId` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `full` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `guide` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `half` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `infant` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `moneyReceived` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `moneyToPayCompany` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `paymentType` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `returnTransferId` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `totalPerson` on the `reservation` table. All the data in the column will be lost.
  - Added the required column `companyRateId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_arrivalTransferId_fkey`;

-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_fromWhoId_fkey`;

-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_returnTransferId_fkey`;

-- DropIndex
DROP INDEX `Reservation_arrivalTransferId_fkey` ON `reservation`;

-- DropIndex
DROP INDEX `Reservation_fromWhoId_fkey` ON `reservation`;

-- DropIndex
DROP INDEX `Reservation_returnTransferId_fkey` ON `reservation`;

-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `arrivalTransferId`,
    DROP COLUMN `fromWhoId`,
    DROP COLUMN `full`,
    DROP COLUMN `guide`,
    DROP COLUMN `half`,
    DROP COLUMN `infant`,
    DROP COLUMN `moneyReceived`,
    DROP COLUMN `moneyToPayCompany`,
    DROP COLUMN `paymentType`,
    DROP COLUMN `returnTransferId`,
    DROP COLUMN `totalPerson`,
    ADD COLUMN `arrivalTransferPointId` VARCHAR(191) NULL,
    ADD COLUMN `companyRateId` VARCHAR(191) NOT NULL,
    ADD COLUMN `returnTransferPointId` VARCHAR(191) NULL,
    MODIFY `ship` VARCHAR(191) NULL,
    MODIFY `m1` INTEGER NOT NULL DEFAULT 0,
    MODIFY `m2` INTEGER NOT NULL DEFAULT 0,
    MODIFY `m3` INTEGER NOT NULL DEFAULT 0,
    MODIFY `v1` INTEGER NOT NULL DEFAULT 0,
    MODIFY `v2` INTEGER NOT NULL DEFAULT 0,
    MODIFY `fullPrice` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `tour` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_companyRateId_fkey` FOREIGN KEY (`companyRateId`) REFERENCES `CompanyRate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_arrivalTransferPointId_fkey` FOREIGN KEY (`arrivalTransferPointId`) REFERENCES `TransferPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_returnTransferPointId_fkey` FOREIGN KEY (`returnTransferPointId`) REFERENCES `TransferPoint`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
