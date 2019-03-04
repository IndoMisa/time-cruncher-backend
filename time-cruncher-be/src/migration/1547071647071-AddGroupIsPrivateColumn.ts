import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGroupIsPrivateColumn1547071647071 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `group` ADD `isPrivate` tinyint NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `group` DROP COLUMN `isPrivate`");
    }

}
