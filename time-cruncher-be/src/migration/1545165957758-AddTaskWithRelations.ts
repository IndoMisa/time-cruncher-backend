import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTaskWithRelations1545165957758 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `task` (`id` int NOT NULL AUTO_INCREMENT, `description` varchar(255) NOT NULL, `publishTime` datetime NOT NULL, `dueTime` datetime NULL, `completionTime` datetime NULL, `isCompleted` tinyint NOT NULL, `creatorId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `task_assignment` (`userId` int NOT NULL, `taskId` int NOT NULL, PRIMARY KEY (`userId`, `taskId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `task` ADD CONSTRAINT `FK_94fe6b3a5aec5f85427df4f8cd7` FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`)");
        await queryRunner.query("ALTER TABLE `task_assignment` ADD CONSTRAINT `FK_9b36540581f2d4b820cc481dc41` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `task_assignment` ADD CONSTRAINT `FK_a1a927f2586253f3dd5145e105f` FOREIGN KEY (`taskId`) REFERENCES `task`(`id`) ON DELETE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `task_assignment` DROP FOREIGN KEY `FK_a1a927f2586253f3dd5145e105f`");
        await queryRunner.query("ALTER TABLE `task_assignment` DROP FOREIGN KEY `FK_9b36540581f2d4b820cc481dc41`");
        await queryRunner.query("ALTER TABLE `task` DROP FOREIGN KEY `FK_94fe6b3a5aec5f85427df4f8cd7`");
        await queryRunner.query("DROP TABLE `task_assignment`");
        await queryRunner.query("DROP TABLE `task`");
    }

}
