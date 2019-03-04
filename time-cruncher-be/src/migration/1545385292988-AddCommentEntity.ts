import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCommentEntity1545385292988 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `comment` (`id` int NOT NULL AUTO_INCREMENT, `text` varchar(300) NOT NULL, `postTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `creatorId` int NOT NULL, `taskId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `comment` ADD CONSTRAINT `FK_b6bf60ecb9f6c398e349adff52f` FOREIGN KEY (`creatorId`) REFERENCES `user`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `comment` ADD CONSTRAINT `FK_9fc19c95c33ef4d97d09b72ee95` FOREIGN KEY (`taskId`) REFERENCES `task`(`id`) ON DELETE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `comment` DROP FOREIGN KEY `FK_9fc19c95c33ef4d97d09b72ee95`");
        await queryRunner.query("ALTER TABLE `comment` DROP FOREIGN KEY `FK_b6bf60ecb9f6c398e349adff52f`");
        await queryRunner.query("DROP TABLE `comment`");
    }

}
