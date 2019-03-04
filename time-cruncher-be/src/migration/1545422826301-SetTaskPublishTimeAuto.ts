import {MigrationInterface, QueryRunner} from "typeorm";

export class SetTaskPublishTimeAuto1545422826301 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `task` CHANGE `publishTime` `publishTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `task` CHANGE `publishTime` `publishTime` datetime NOT NULL");
    }

}
