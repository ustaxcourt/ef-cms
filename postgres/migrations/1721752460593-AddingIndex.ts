import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingIndex1721752460593 implements MigrationInterface {
  name = 'AddingIndex1721752460593';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE INDEX "IDX_cca9e3abeff4b0939aa8a25b3e" ON "message" ("completedBySection") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_db0d579b205db9e5cea5e2e0df" ON "message" ("completedByUserId") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_5c6b9074994ba166011d5dd0b2" ON "message" ("docketNumber") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_c2d824eb9ff032e8caa384467d" ON "message" ("fromSection") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_c59262513a3006fd8f58bb4b7c" ON "message" ("fromUserId") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_575b24e003b8881e64fa53cd16" ON "message" ("parentMessageId") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_09e34b5dac1edc3182e0b349ef" ON "message" ("toSection") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_96789153e31e0bb7885ea13a27" ON "message" ("toUserId") ',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX "public"."IDX_96789153e31e0bb7885ea13a27"',
    );
    await queryRunner.query(
      'DROP INDEX "public"."IDX_09e34b5dac1edc3182e0b349ef"',
    );
    await queryRunner.query(
      'DROP INDEX "public"."IDX_575b24e003b8881e64fa53cd16"',
    );
    await queryRunner.query(
      'DROP INDEX "public"."IDX_c59262513a3006fd8f58bb4b7c"',
    );
    await queryRunner.query(
      'DROP INDEX "public"."IDX_c2d824eb9ff032e8caa384467d"',
    );
    await queryRunner.query(
      'DROP INDEX "public"."IDX_5c6b9074994ba166011d5dd0b2"',
    );
    await queryRunner.query(
      'DROP INDEX "public"."IDX_db0d579b205db9e5cea5e2e0df"',
    );
    await queryRunner.query(
      'DROP INDEX "public"."IDX_cca9e3abeff4b0939aa8a25b3e"',
    );
  }
}
