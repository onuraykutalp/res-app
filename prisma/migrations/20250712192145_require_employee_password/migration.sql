/*
  Warnings:

  - Made the column `password` on table `employee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `employee` MODIFY `password` VARCHAR(191) NOT NULL;
