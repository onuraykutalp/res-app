/*
  Warnings:

  - Made the column `m1` on table `companyrate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `m2` on table `companyrate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `m3` on table `companyrate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `v1` on table `companyrate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `v2` on table `companyrate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tax` on table `companyrate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `companyrate` MODIFY `m1` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `m2` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `m3` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `v1` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `v2` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `tax` DOUBLE NOT NULL DEFAULT 0;
