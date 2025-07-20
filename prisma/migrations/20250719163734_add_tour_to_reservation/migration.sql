/*
  Warnings:

  - You are about to drop the column `m1Price` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `m2Price` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `m3Price` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `menuId` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `v1Price` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `v2Price` on the `reservation` table. All the data in the column will be lost.
  - You are about to alter the column `paymentType` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Added the required column `full` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullPrice` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guide` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `half` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `infant` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moneyReceived` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moneyToPayCompany` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPerson` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_menuId_fkey`;

-- DropIndex
DROP INDEX `Reservation_menuId_fkey` ON `reservation`;

-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `m1Price`,
    DROP COLUMN `m2Price`,
    DROP COLUMN `m3Price`,
    DROP COLUMN `menuId`,
    DROP COLUMN `price`,
    DROP COLUMN `v1Price`,
    DROP COLUMN `v2Price`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `full` INTEGER NOT NULL,
    ADD COLUMN `fullPrice` DOUBLE NOT NULL,
    ADD COLUMN `guide` INTEGER NOT NULL,
    ADD COLUMN `half` INTEGER NOT NULL,
    ADD COLUMN `infant` INTEGER NOT NULL,
    ADD COLUMN `moneyReceived` DOUBLE NOT NULL,
    ADD COLUMN `moneyToPayCompany` DOUBLE NOT NULL,
    ADD COLUMN `totalPerson` INTEGER NOT NULL,
    ADD COLUMN `tour` JSON NULL,
    MODIFY `nationality` VARCHAR(191) NULL,
    MODIFY `paymentType` ENUM('Gemide', 'Cari', 'Comp', 'Komisyonsuz') NOT NULL,
    ALTER COLUMN `m1` DROP DEFAULT,
    ALTER COLUMN `m2` DROP DEFAULT,
    ALTER COLUMN `m3` DROP DEFAULT,
    ALTER COLUMN `v1` DROP DEFAULT,
    ALTER COLUMN `v2` DROP DEFAULT;
