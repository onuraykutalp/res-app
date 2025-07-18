/*
  Warnings:

  - You are about to drop the column `driver` on the `transfer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transfer` DROP COLUMN `driver`,
    ADD COLUMN `driverId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Driver` (
    `id` VARCHAR(191) NOT NULL,
    `driverName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `license` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `brand` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
