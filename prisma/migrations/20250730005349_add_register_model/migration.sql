-- CreateTable
CREATE TABLE `Register` (
    `id` VARCHAR(191) NOT NULL,
    `ship` VARCHAR(191) NOT NULL,
    `reservationId` VARCHAR(191) NULL,
    `clientId` VARCHAR(191) NULL,
    `companyDebtId` VARCHAR(191) NULL,
    `groupName` VARCHAR(191) NOT NULL,
    `accountType` ENUM('GEMI_KASA_TRY', 'GEMI_KASA_EUR', 'GEMI_KASA_USD', 'GEMI_KASA_GBP', 'ISBANK_POS_TRY', 'ISBANK_POS_EUR', 'ISBANK_POS_USD') NOT NULL,
    `entry` DOUBLE NOT NULL DEFAULT 0,
    `out` DOUBLE NOT NULL DEFAULT 0,
    `currency` ENUM('TRY', 'EUR', 'USD', 'GBP') NOT NULL,
    `description` VARCHAR(191) NULL,
    `receiptDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdById` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Register` ADD CONSTRAINT `Register_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Register` ADD CONSTRAINT `Register_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Register` ADD CONSTRAINT `Register_companyDebtId_fkey` FOREIGN KEY (`companyDebtId`) REFERENCES `company_debts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Register` ADD CONSTRAINT `Register_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
