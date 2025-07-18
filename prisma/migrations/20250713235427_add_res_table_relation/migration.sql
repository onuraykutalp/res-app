/*
  Warnings:

  - You are about to drop the column `resTable` on the `reservation` table. All the data in the column will be lost.
  - Added the required column `resTableId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `resTable`,
    ADD COLUMN `resTableId` VARCHAR(191) NOT NULL,
    MODIFY `date` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `ResTable` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `capacity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_resTableId_fkey` FOREIGN KEY (`resTableId`) REFERENCES `ResTable`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
