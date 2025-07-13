-- CreateTable
CREATE TABLE `Reservation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `fromWho` VARCHAR(191) NOT NULL,
    `resTable` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `companyPrice` INTEGER NOT NULL,
    `agency` VARCHAR(191) NULL,
    `m1` INTEGER NOT NULL,
    `m2` INTEGER NOT NULL,
    `m3` INTEGER NOT NULL,
    `v1` INTEGER NOT NULL,
    `v2` INTEGER NOT NULL,
    `total` INTEGER NOT NULL,
    `room` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `payment` VARCHAR(191) NOT NULL,
    `resTaker` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
