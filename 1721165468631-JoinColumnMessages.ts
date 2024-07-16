import { MigrationInterface, QueryRunner } from 'typeorm';

export class JoinColumnMessages1721165468631 implements MigrationInterface {
  name = 'JoinColumnMessages1721165468631';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "message" DROP CONSTRAINT "FK_2dad987847361722fd55a8c19fa"',
    );
    await queryRunner.query(
      'ALTER TABLE "message" DROP COLUMN "caseDocketNumber"',
    );
    await queryRunner.query(
      'ALTER TABLE "message" ADD CONSTRAINT "FK_5c6b9074994ba166011d5dd0b26" FOREIGN KEY ("docketNumber") REFERENCES "case"("docketNumber") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "message" DROP CONSTRAINT "FK_5c6b9074994ba166011d5dd0b26"',
    );
    await queryRunner.query(
      'ALTER TABLE "message" ADD "caseDocketNumber" character varying',
    );
    await queryRunner.query(
      'ALTER TABLE "message" ADD CONSTRAINT "FK_2dad987847361722fd55a8c19fa" FOREIGN KEY ("caseDocketNumber") REFERENCES "case"("docketNumber") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }
}
