import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAccessTokenTable1547117119562 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `access_token` (`userId` int NOT NULL, `accessToken` varchar(25) NOT NULL, PRIMARY KEY (`userId`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `access_token`");
    }

}
