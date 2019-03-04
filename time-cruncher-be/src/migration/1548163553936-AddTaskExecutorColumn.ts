import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTaskExecutorColumn1548163553936 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `task` ADD `executorId` int NULL");
        await queryRunner.query("ALTER TABLE `task` ADD CONSTRAINT `FK_de1876565f93fd5fae3a73cc8f9` FOREIGN KEY (`executorId`) REFERENCES `user`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `task` DROP FOREIGN KEY `FK_de1876565f93fd5fae3a73cc8f9`");
        await queryRunner.query("ALTER TABLE `task` DROP COLUMN `executorId`");
    }

}
