import { MigrationInterface, QueryRunner } from "typeorm";

export class Posts1720534008765 implements MigrationInterface {
    name = 'Posts1720534008765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL, "title" character varying NOT NULL, "content" character varying, "user_id" uuid, "created_at" TIMESTAMP NOT NULL, "created_by" uuid, "updated_at" TIMESTAMP NOT NULL, "updated_by" uuid, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`);
        await queryRunner.query(`DROP TABLE "posts"`);
    }
}
