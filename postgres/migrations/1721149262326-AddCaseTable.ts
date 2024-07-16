import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCaseTable1721149262326 implements MigrationInterface {
  name = 'AddCaseTable1721149262326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "case" ("docketNumber" character varying NOT NULL, "trialLocation" character varying, "trialDate" character varying, CONSTRAINT "PK_22bea6459f33e75269daee9bb49" PRIMARY KEY ("docketNumber"))',
    );
    await queryRunner.query(
      'ALTER TABLE "message" ADD "caseDocketNumber" character varying',
    );
    await queryRunner.query(
      'ALTER TABLE "message" ADD CONSTRAINT "FK_2dad987847361722fd55a8c19fa" FOREIGN KEY ("caseDocketNumber") REFERENCES "case"("docketNumber") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "message" DROP CONSTRAINT "FK_2dad987847361722fd55a8c19fa"',
    );
    await queryRunner.query(
      'ALTER TABLE "message" DROP COLUMN "caseDocketNumber"',
    );
    await queryRunner.query('DROP TABLE "case"');
  }
}
