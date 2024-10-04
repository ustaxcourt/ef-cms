import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Index for docketNumber
  await db.schema
    .createIndex('idx_message_docketNumber')
    .on('dwMessage')
    .column('docketNumber')
    .execute();

  // Index for parentMessageId
  await db.schema
    .createIndex('idx_message_parentMessageId')
    .on('dwMessage')
    .column('parentMessageId')
    .execute();

  // Index for completedBySection
  await db.schema
    .createIndex('idx_message_completedBySection')
    .on('dwMessage')
    .column('completedBySection')
    .execute();

  // Index for isCompleted
  await db.schema
    .createIndex('idx_message_isCompleted')
    .on('dwMessage')
    .column('isCompleted')
    .execute();

  // Index for createdAt
  await db.schema
    .createIndex('idx_message_createdAt')
    .on('dwMessage')
    .column('createdAt')
    .execute();

  // Index for completedByUserId
  await db.schema
    .createIndex('idx_message_completedByUserId')
    .on('dwMessage')
    .column('completedByUserId')
    .execute();

  // Index for completedAt
  await db.schema
    .createIndex('idx_message_completedAt')
    .on('dwMessage')
    .column('completedAt')
    .execute();

  // Index for toSection
  await db.schema
    .createIndex('idx_message_toSection')
    .on('dwMessage')
    .column('toSection')
    .execute();

  // Index for isRepliedTo
  await db.schema
    .createIndex('idx_message_isRepliedTo')
    .on('dwMessage')
    .column('isRepliedTo')
    .execute();

  // Index for fromSection
  await db.schema
    .createIndex('idx_message_fromSection')
    .on('dwMessage')
    .column('fromSection')
    .execute();

  // Index for toUserId
  await db.schema
    .createIndex('idx_message_toUserId')
    .on('dwMessage')
    .column('toUserId')
    .execute();

  // Index for fromUserId
  await db.schema
    .createIndex('idx_message_fromUserId')
    .on('dwMessage')
    .column('fromUserId')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop indexes in reverse order to ensure clean rollback

  await db.schema.dropIndex('idx_message_fromUserId').on('dwMessage').execute();
  await db.schema.dropIndex('idx_message_toUserId').on('dwMessage').execute();
  await db.schema
    .dropIndex('idx_message_fromSection')
    .on('dwMessage')
    .execute();
  await db.schema
    .dropIndex('idx_message_isRepliedTo')
    .on('dwMessage')
    .execute();
  await db.schema.dropIndex('idx_message_toSection').on('dwMessage').execute();
  await db.schema
    .dropIndex('idx_message_completedAt')
    .on('dwMessage')
    .execute();
  await db.schema
    .dropIndex('idx_message_completedByUserId')
    .on('dwMessage')
    .execute();
  await db.schema.dropIndex('idx_message_createdAt').on('dwMessage').execute();
  await db.schema
    .dropIndex('idx_message_isCompleted')
    .on('dwMessage')
    .execute();
  await db.schema
    .dropIndex('idx_message_completedBySection')
    .on('dwMessage')
    .execute();
  await db.schema
    .dropIndex('idx_message_parentMessageId')
    .on('dwMessage')
    .execute();
  await db.schema
    .dropIndex('idx_message_docketNumber')
    .on('dwMessage')
    .execute();
}
