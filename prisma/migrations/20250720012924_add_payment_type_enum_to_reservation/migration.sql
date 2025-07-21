/*
  Warnings:

  - Added the required column `paymentType` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `paymentType` ENUM('Gemide', 'Cari', 'Comp', 'Komisyonsuz') NOT NULL;
