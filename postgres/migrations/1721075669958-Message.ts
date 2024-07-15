import { MigrationInterface, QueryRunner } from 'typeorm';

export class Message1721075669958 implements MigrationInterface {
  name = 'Message1721075669958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "message" ("attachments" jsonb, "caseStatus" character varying NOT NULL, "caseTitle" character varying NOT NULL, "completedAt" character varying, "completedBy" character varying, "completedBySection" character varying, "completedByUserId" character varying, "completedMessage" character varying, "createdAt" character varying NOT NULL, "docketNumber" character varying NOT NULL, "docketNumberWithSuffix" character varying NOT NULL, "from" character varying NOT NULL, "fromSection" character varying NOT NULL, "fromUserId" character varying NOT NULL, "isCompleted" boolean NOT NULL, "isRead" boolean NOT NULL, "isRepliedTo" boolean NOT NULL, "leadDocketNumber" character varying, "message" character varying NOT NULL, "messageId" character varying NOT NULL, "parentMessageId" character varying NOT NULL, "subject" character varying NOT NULL, "to" character varying NOT NULL, "toSection" character varying NOT NULL, "toUserId" character varying NOT NULL, CONSTRAINT "PK_b664c8ae63d634326ce5896cecc" PRIMARY KEY ("messageId"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "message"');
  }
}
