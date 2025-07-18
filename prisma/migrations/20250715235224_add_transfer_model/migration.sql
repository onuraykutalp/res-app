-- CreateTable
CREATE TABLE `TransferLocation` (
    `id` VARCHAR(191) NOT NULL,
    `locationName` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransferPoint` (
    `id` VARCHAR(191) NOT NULL,
    `transferPointName` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `locationId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transfer` (
    `id` VARCHAR(191) NOT NULL,
    `driver` VARCHAR(191) NULL,
    `personQuantity` INTEGER NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `transferDesc` VARCHAR(191) NULL,
    `transferLocationId` VARCHAR(191) NOT NULL,
    `transferPointId` VARCHAR(191) NOT NULL,
    `reservationId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TransferPoint` ADD CONSTRAINT `TransferPoint_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `TransferLocation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_transferLocationId_fkey` FOREIGN KEY (`transferLocationId`) REFERENCES `TransferLocation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_transferPointId_fkey` FOREIGN KEY (`transferPointId`) REFERENCES `TransferPoint`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
