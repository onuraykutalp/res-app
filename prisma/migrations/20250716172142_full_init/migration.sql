/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_saloonId_fkey`;

-- DropIndex
DROP INDEX `Reservation_saloonId_fkey` ON `reservation`;

-- AlterTable
ALTER TABLE `reservation` MODIFY `saloonId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employee_username_key` ON `Employee`(`username`);

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_saloonId_fkey` FOREIGN KEY (`saloonId`) REFERENCES `Saloon`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
