import {MigrationInterface, QueryRunner} from "typeorm";

export class IncreaseCommentSize1547552349449 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `comment` DROP COLUMN `text`");
        await queryRunner.query("ALTER TABLE `comment` ADD `text` varchar(1000) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `comment` DROP COLUMN `text`");
        await queryRunner.query("ALTER TABLE `comment` ADD `text` varchar(300) NOT NULL");
    }

}
