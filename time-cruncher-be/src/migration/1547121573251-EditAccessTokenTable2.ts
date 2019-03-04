import {MigrationInterface, QueryRunner} from "typeorm";

export class EditAccessTokenTable21547121573251 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_9949557d0e1b2c19e5344c171e` ON `access_token`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_9949557d0e1b2c19e5344c171e` ON `access_token`(`userId`)");
    }

}
