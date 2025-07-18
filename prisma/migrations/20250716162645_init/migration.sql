/*
  Warnings:

  - Made the column `saloonId` on table `reservation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_saloonId_fkey`;

-- DropIndex
DROP INDEX `Reservation_saloonId_fkey` ON `reservation`;

-- AlterTable
ALTER TABLE `reservation` MODIFY `saloonId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_saloonId_fkey` FOREIGN KEY (`saloonId`) REFERENCES `Saloon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
