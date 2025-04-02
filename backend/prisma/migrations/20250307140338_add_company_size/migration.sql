-- AlterTable
ALTER TABLE `company` ADD COLUMN `sizeId` INTEGER NULL;

-- CreateTable
CREATE TABLE `CompanySize` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `minEmployees` INTEGER NOT NULL,
    `maxEmployees` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `CompanySize`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
