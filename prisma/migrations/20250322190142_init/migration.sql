-- Crear la tabla `User`
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER') NOT NULL DEFAULT 'TEAM_MEMBER',
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear la tabla `Project`
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear la tabla `Task`
CREATE TABLE `Task` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `projectId` VARCHAR(191) NOT NULL,
    `status` ENUM('Por hacer', 'En curso', 'Bloqueada', 'Completada') NOT NULL DEFAULT 'Por hacer',
    `comments` TEXT,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Agregar clave foránea en la tabla `Task` para `projectId`
ALTER TABLE `Task`
ADD CONSTRAINT `Task_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Agregar columna `assignedTo` a la tabla `Task`
ALTER TABLE `Task`
ADD COLUMN `assignedTo` VARCHAR(191) NULL;

-- Agregar clave foránea para `assignedTo` en la tabla `Task`
ALTER TABLE `Task`
ADD CONSTRAINT `Task_assignedTo_fkey` FOREIGN KEY (`assignedTo`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Modificar la columna `role` en la tabla `User`
ALTER TABLE `user` 
MODIFY `role` ENUM('ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER') NOT NULL DEFAULT 'TEAM_MEMBER';

-- Eliminar la columna `assignedTo` de la tabla `Task`
ALTER TABLE `Task` 
DROP FOREIGN KEY `Task_assignedTo_fkey`;

-- Eliminar índice relacionado con `assignedTo`
DROP INDEX `Task_assignedTo_fkey` ON `Task`;

ALTER TABLE `Task` 
DROP COLUMN `assignedTo`;

-- Crear la nueva tabla `_TaskAssignees`
CREATE TABLE `_TaskAssignees` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,
    UNIQUE INDEX `_TaskAssignees_AB_unique`(`A`, `B`),
    INDEX `_TaskAssignees_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Agregar claves foráneas en la nueva tabla `_TaskAssignees`
ALTER TABLE `_TaskAssignees`
ADD CONSTRAINT `_TaskAssignees_A_fkey` FOREIGN KEY (`A`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `_TaskAssignees`
ADD CONSTRAINT `_TaskAssignees_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;