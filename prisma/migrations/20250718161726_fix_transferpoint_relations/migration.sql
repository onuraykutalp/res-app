/*
  Warnings:

  - You are about to drop the column `createdAt` on the `reservation` table. All the data in the column will be lost.
  - Made the column `saloonId` on table `reservation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_fromWhoId_fkey`;

-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_saloonId_fkey`;

-- DropForeignKey
ALTER TABLE `transfer` DROP FOREIGN KEY `Transfer_reservationId_fkey`;

-- DropIndex
DROP INDEX `Reservation_fromWhoId_fkey` ON `reservation`;

-- DropIndex
DROP INDEX `Reservation_saloonId_fkey` ON `reservation`;

-- DropIndex
DROP INDEX `Transfer_reservationId_key` ON `transfer`;

-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `createdAt`,
    MODIFY `fromWhoId` VARCHAR(191) NULL,
    MODIFY `saloonId` VARCHAR(191) NOT NULL,
    MODIFY `voucherNo` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_fromWhoId_fkey` FOREIGN KEY (`fromWhoId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_saloonId_fkey` FOREIGN KEY (`saloonId`) REFERENCES `Saloon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
