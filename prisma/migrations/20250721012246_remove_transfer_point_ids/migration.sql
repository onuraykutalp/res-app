/*
  Warnings:

  - You are about to drop the column `arrivalTransferPointId` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `returnTransferPointId` on the `reservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_arrivalTransferPointId_fkey`;

-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_returnTransferPointId_fkey`;

-- DropIndex
DROP INDEX `Reservation_arrivalTransferPointId_fkey` ON `reservation`;

-- DropIndex
DROP INDEX `Reservation_returnTransferPointId_fkey` ON `reservation`;

-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `arrivalTransferPointId`,
    DROP COLUMN `returnTransferPointId`;
