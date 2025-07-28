/*
  Warnings:

  - You are about to drop the column `company` on the `companyrate` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `companyrate` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `companyrate` table. All the data in the column will be lost.
  - The primary key for the `income` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `incomeId` on the `income` table. All the data in the column will be lost.
  - You are about to drop the column `incomeName` on the `income` table. All the data in the column will be lost.
  - You are about to drop the column `incomeTax` on the `income` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `CompanyRate` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Income` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `Income` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_companyRateId_fkey`;

-- DropIndex
DROP INDEX `Reservation_companyRateId_fkey` ON `reservation`;

-- AlterTable
ALTER TABLE `companyrate` DROP COLUMN `company`,
    DROP COLUMN `currency`,
    DROP COLUMN `description`,
    ADD COLUMN `balance` DOUBLE NULL,
    ADD COLUMN `companyName` VARCHAR(191) NOT NULL,
    ADD COLUMN `companyType` VARCHAR(191) NULL,
    ADD COLUMN `credit` DOUBLE NULL,
    ADD COLUMN `debt` DOUBLE NULL,
    ADD COLUMN `lastReservation` DATETIME(3) NULL,
    ADD COLUMN `tax` DOUBLE NULL,
    MODIFY `m1` DOUBLE NULL,
    MODIFY `m2` DOUBLE NULL,
    MODIFY `m3` DOUBLE NULL,
    MODIFY `v1` DOUBLE NULL,
    MODIFY `v2` DOUBLE NULL;

-- AlterTable
ALTER TABLE `income` DROP PRIMARY KEY,
    DROP COLUMN `incomeId`,
    DROP COLUMN `incomeName`,
    DROP COLUMN `incomeTax`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `tax` DOUBLE NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `reservation` MODIFY `companyRateId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_companyRateId_fkey` FOREIGN KEY (`companyRateId`) REFERENCES `CompanyRate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
