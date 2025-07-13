/*
  Warnings:

  - You are about to drop the column `fromWho` on the `reservation` table. All the data in the column will be lost.
  - You are about to drop the column `resTaker` on the `reservation` table. All the data in the column will be lost.
  - You are about to alter the column `date` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `price` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `companyPrice` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `m1` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `m2` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `m3` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `v1` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `v2` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `total` on the `reservation` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - Added the required column `fromWhoId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resTakerId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservation` DROP COLUMN `fromWho`,
    DROP COLUMN `resTaker`,
    ADD COLUMN `fromWhoId` VARCHAR(191) NOT NULL,
    ADD COLUMN `resTakerId` VARCHAR(191) NOT NULL,
    MODIFY `date` DATETIME(3) NOT NULL,
    MODIFY `price` DOUBLE NOT NULL,
    MODIFY `companyPrice` DOUBLE NOT NULL,
    MODIFY `m1` DOUBLE NOT NULL,
    MODIFY `m2` DOUBLE NOT NULL,
    MODIFY `m3` DOUBLE NOT NULL,
    MODIFY `v1` DOUBLE NOT NULL,
    MODIFY `v2` DOUBLE NOT NULL,
    MODIFY `total` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `clientType` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `tax` VARCHAR(191) NULL,
    `limit` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `whoCreatedId` VARCHAR(191) NOT NULL,
    `whoUpdatedId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `phone` BIGINT NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `groupId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Employee_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmployeeGroup` (
    `id` VARCHAR(191) NOT NULL,
    `groupName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `EmployeeGroup_groupName_key`(`groupName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_fromWhoId_fkey` FOREIGN KEY (`fromWhoId`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_resTakerId_fkey` FOREIGN KEY (`resTakerId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_whoCreatedId_fkey` FOREIGN KEY (`whoCreatedId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_whoUpdatedId_fkey` FOREIGN KEY (`whoUpdatedId`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `EmployeeGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
