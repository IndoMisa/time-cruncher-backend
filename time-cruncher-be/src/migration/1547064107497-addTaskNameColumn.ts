import {MigrationInterface, QueryRunner} from "typeorm";

export class addTaskNameColumn1547064107497 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `task` ADD `name` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `task` CHANGE `description` `description` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `task` CHANGE `description` `description` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `task` DROP COLUMN `name`");
    }

}
