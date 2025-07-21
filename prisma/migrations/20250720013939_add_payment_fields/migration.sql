-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `moneyReceived` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `moneyToPayCompany` DOUBLE NOT NULL DEFAULT 0;
