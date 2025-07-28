-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_resTableId_fkey`;

-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_saloonId_fkey`;

-- DropIndex
DROP INDEX `Reservation_resTableId_fkey` ON `reservation`;

-- DropIndex
DROP INDEX `Reservation_saloonId_fkey` ON `reservation`;

-- AlterTable
ALTER TABLE `reservation` MODIFY `resTableId` VARCHAR(191) NULL,
    MODIFY `saloonId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_saloonId_fkey` FOREIGN KEY (`saloonId`) REFERENCES `Saloon`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_resTableId_fkey` FOREIGN KEY (`resTableId`) REFERENCES `ResTable`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
