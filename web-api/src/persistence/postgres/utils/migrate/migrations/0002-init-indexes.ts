import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Index for docketNumber
  await db.schema
    .createIndex('idxMessageDocketNumber')
    .on('dwMessage')
    .column('docketNumber')
    .execute();

  // Index for parentMessageId
  await db.schema
    .createIndex('idxMessageParentMessageId')
    .on('dwMessage')
    .column('parentMessageId')
    .execute();

  // Index for completedBySection
  await db.schema
    .createIndex('idxMessageCompletedBySection')
    .on('dwMessage')
    .column('completedBySection')
    .execute();

  // Index for isCompleted
  await db.schema
    .createIndex('idxMessageIsCompleted')
    .on('dwMessage')
    .column('isCompleted')
    .execute();

  // Index for createdAt
  await db.schema
    .createIndex('idxMessageCreatedAt')
    .on('dwMessage')
    .column('createdAt')
    .execute();

  // Index for completedByUserId
  await db.schema
    .createIndex('idxMessageCompletedByUserId')
    .on('dwMessage')
    .column('completedByUserId')
    .execute();

  // Index for completedAt
  await db.schema
    .createIndex('idxMessageCompletedAt')
    .on('dwMessage')
    .column('completedAt')
    .execute();

  // Index for toSection
  await db.schema
    .createIndex('idxMessageToSection')
    .on('dwMessage')
    .column('toSection')
    .execute();

  // Index for isRepliedTo
  await db.schema
    .createIndex('idxMessageIsRepliedTo')
    .on('dwMessage')
    .column('isRepliedTo')
    .execute();

  // Index for fromSection
  await db.schema
    .createIndex('idxMessageFromSection')
    .on('dwMessage')
    .column('fromSection')
    .execute();

  // Index for toUserId
  await db.schema
    .createIndex('idxMessageToUserId')
    .on('dwMessage')
    .column('toUserId')
    .execute();

  // Index for fromUserId
  await db.schema
    .createIndex('idxMessageFromUserId')
    .on('dwMessage')
    .column('fromUserId')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop indexes in reverse order to ensure clean rollback
  await db.schema.dropIndex('idxMessageFromUserId').execute();
  await db.schema.dropIndex('idxMessageToUserId').execute();
  await db.schema.dropIndex('idxMessageFromSection').execute();
  await db.schema.dropIndex('idxMessageIsRepliedTo').execute();
  await db.schema.dropIndex('idxMessageToSection').execute();
  await db.schema.dropIndex('idxMessageCompletedAt').execute();
  await db.schema.dropIndex('idxMessageCompletedByUserId').execute();
  await db.schema.dropIndex('idxMessageCreatedAt').execute();
  await db.schema.dropIndex('idxMessageIsCompleted').execute();
  await db.schema.dropIndex('idxMessageCompletedBySection').execute();
  await db.schema.dropIndex('idxMessageParentMessageId').execute();
  await db.schema.dropIndex('idxMessageDocketNumber').execute();
}
