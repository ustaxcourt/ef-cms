import { MigrationInterface, QueryRunner } from 'typeorm';

export class MessageCaseOptional1721834206951 implements MigrationInterface {
  name = 'MessageCaseOptional1721834206951';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "message" DROP CONSTRAINT "FK_5c6b9074994ba166011d5dd0b26"',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "message" ADD CONSTRAINT "FK_5c6b9074994ba166011d5dd0b26" FOREIGN KEY ("docketNumber") REFERENCES "case"("docketNumber") ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }
}
