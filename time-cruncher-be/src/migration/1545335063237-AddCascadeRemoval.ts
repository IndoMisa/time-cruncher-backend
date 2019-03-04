import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCascadeRemoval1545335063237 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `task` DROP FOREIGN KEY `FK_94fe6b3a5aec5f85427df4f8cd7`");
        await queryRunner.query("ALTER TABLE `task` ADD CONSTRAINT `FK_94fe6b3a5aec5f85427df4f8cd7` FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON DELETE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `task` DROP FOREIGN KEY `FK_94fe6b3a5aec5f85427df4f8cd7`");
        await queryRunner.query("ALTER TABLE `task` ADD CONSTRAINT `FK_94fe6b3a5aec5f85427df4f8cd7` FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
