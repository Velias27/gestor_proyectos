/*
  Warnings:

  - Added the required column `endDate` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `project` ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL;
