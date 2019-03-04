import {MigrationInterface, QueryRunner} from "typeorm";

export class EditAccessTokenTable41547123553438 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `access_token` CHANGE `accessToken` `token` varchar(25) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `access_token` CHANGE `token` `accessToken` varchar(25) NOT NULL");
    }

}
