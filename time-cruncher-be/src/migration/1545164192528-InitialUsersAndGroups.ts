import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialUsersAndGroups1545164192528 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `firstname` varchar(20) NOT NULL, `lastname` varchar(20) NOT NULL, `email` varchar(80) NOT NULL, `password` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `group` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL, `description` varchar(200) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user_group` (`userId` int NOT NULL, `groupId` int NOT NULL, PRIMARY KEY (`userId`, `groupId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user_group` ADD CONSTRAINT `FK_3d6b372788ab01be58853003c93` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `user_group` ADD CONSTRAINT `FK_31e541c93fdc0bb63cfde6549b7` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`) ON DELETE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user_group` DROP FOREIGN KEY `FK_31e541c93fdc0bb63cfde6549b7`");
        await queryRunner.query("ALTER TABLE `user_group` DROP FOREIGN KEY `FK_3d6b372788ab01be58853003c93`");
        await queryRunner.query("DROP TABLE `user_group`");
        await queryRunner.query("DROP TABLE `group`");
        await queryRunner.query("DROP TABLE `user`");
    }

}
