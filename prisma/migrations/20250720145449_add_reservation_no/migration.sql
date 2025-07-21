/*
  Warnings:

  - A unique constraint covering the columns `[reservationNo]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reservationNo` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `reservationNo` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Reservation_reservationNo_key` ON `Reservation`(`reservationNo`);
