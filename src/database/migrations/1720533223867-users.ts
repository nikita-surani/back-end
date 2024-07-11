import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1720533223867 implements MigrationInterface {
    name = 'Users1720533223867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "user_name" character varying NOT NULL, "email_address" character varying NOT NULL, "password" character varying, "created_at" TIMESTAMP NOT NULL, "created_by" uuid, "updated_at" TIMESTAMP NOT NULL, "updated_by" uuid, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
