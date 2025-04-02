/*
  Warnings:

  - You are about to drop the column `description` on the `job` table. All the data in the column will be lost.
  - Added the required column `benefits` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `candidateRequirements` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobDescription` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workingHours` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `job` DROP COLUMN `description`,
    ADD COLUMN `benefits` VARCHAR(191) NOT NULL,
    ADD COLUMN `candidateRequirements` VARCHAR(191) NOT NULL,
    ADD COLUMN `jobDescription` VARCHAR(191) NOT NULL,
    ADD COLUMN `workingHours` VARCHAR(191) NOT NULL;
