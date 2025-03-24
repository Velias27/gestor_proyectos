-- AlterTable
ALTER TABLE `task` ADD COLUMN `assignedTo` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_assignedTo_fkey` FOREIGN KEY (`assignedTo`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
