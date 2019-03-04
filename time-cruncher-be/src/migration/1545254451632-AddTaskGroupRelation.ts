import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTaskGroupRelation1545254451632 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `task` ADD `groupId` int NULL");
        await queryRunner.query("ALTER TABLE `task` ADD CONSTRAINT `FK_b8e1728a46f2cbb7b937011ae4f` FOREIGN KEY (`groupId`) REFERENCES `group`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `task` DROP FOREIGN KEY `FK_b8e1728a46f2cbb7b937011ae4f`");
        await queryRunner.query("ALTER TABLE `task` DROP COLUMN `groupId`");
    }

}
