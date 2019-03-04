import {MigrationInterface, QueryRunner} from "typeorm";

export class EditAccessTokenTable1547120931382 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `access_token` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `access_token` ADD PRIMARY KEY (`userId`, `accessToken`)");
        await queryRunner.query("ALTER TABLE `access_token` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `access_token` ADD PRIMARY KEY (`accessToken`)");
        await queryRunner.query("ALTER TABLE `access_token` ADD UNIQUE INDEX `IDX_9949557d0e1b2c19e5344c171e` (`userId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_9949557d0e1b2c19e5344c171e` ON `access_token`(`userId`)");
        await queryRunner.query("ALTER TABLE `access_token` ADD CONSTRAINT `FK_9949557d0e1b2c19e5344c171e9` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `access_token` DROP FOREIGN KEY `FK_9949557d0e1b2c19e5344c171e9`");
        await queryRunner.query("DROP INDEX `REL_9949557d0e1b2c19e5344c171e` ON `access_token`");
        await queryRunner.query("ALTER TABLE `access_token` DROP INDEX `IDX_9949557d0e1b2c19e5344c171e`");
        await queryRunner.query("ALTER TABLE `access_token` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `access_token` ADD PRIMARY KEY (`accessToken`, `userId`)");
        await queryRunner.query("ALTER TABLE `access_token` DROP PRIMARY KEY");
        await queryRunner.query("ALTER TABLE `access_token` ADD PRIMARY KEY (`userId`)");
    }

}
