/*
  Warnings:

  - Added the required column `price` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `m1` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `m1Price` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `m2` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `m2Price` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `m3` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `m3Price` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `price` DOUBLE NOT NULL,
    ADD COLUMN `v1` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `v1Price` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `v2` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `v2Price` DOUBLE NOT NULL DEFAULT 0;
