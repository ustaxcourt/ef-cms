import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Index for docketNumber
  await db.schema
    .createIndex('idx_message_docketNumber')
    .on('message')
    .column('docketNumber')
    .execute();

  // Index for parentMessageId
  await db.schema
    .createIndex('idx_message_parentMessageId')
    .on('message')
    .column('parentMessageId')
    .execute();

  // Index for completedBySection
  await db.schema
    .createIndex('idx_message_completedBySection')
    .on('message')
    .column('completedBySection')
    .execute();

  // Index for isCompleted
  await db.schema
    .createIndex('idx_message_isCompleted')
    .on('message')
    .column('isCompleted')
    .execute();

  // Index for createdAt
  await db.schema
    .createIndex('idx_message_createdAt')
    .on('message')
    .column('createdAt')
    .execute();

  // Index for completedByUserId
  await db.schema
    .createIndex('idx_message_completedByUserId')
    .on('message')
    .column('completedByUserId')
    .execute();

  // Index for completedAt
  await db.schema
    .createIndex('idx_message_completedAt')
    .on('message')
    .column('completedAt')
    .execute();

  // Index for toSection
  await db.schema
    .createIndex('idx_message_toSection')
    .on('message')
    .column('toSection')
    .execute();

  // Index for isRepliedTo
  await db.schema
    .createIndex('idx_message_isRepliedTo')
    .on('message')
    .column('isRepliedTo')
    .execute();

  // Index for fromSection
  await db.schema
    .createIndex('idx_message_fromSection')
    .on('message')
    .column('fromSection')
    .execute();

  // Index for toUserId
  await db.schema
    .createIndex('idx_message_toUserId')
    .on('message')
    .column('toUserId')
    .execute();

  // Index for fromUserId
  await db.schema
    .createIndex('idx_message_fromUserId')
    .on('message')
    .column('fromUserId')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop indexes in reverse order to ensure clean rollback

  await db.schema.dropIndex('idx_message_fromUserId').on('message').execute();
  await db.schema.dropIndex('idx_message_toUserId').on('message').execute();
  await db.schema.dropIndex('idx_message_fromSection').on('message').execute();
  await db.schema.dropIndex('idx_message_isRepliedTo').on('message').execute();
  await db.schema.dropIndex('idx_message_toSection').on('message').execute();
  await db.schema.dropIndex('idx_message_completedAt').on('message').execute();
  await db.schema
    .dropIndex('idx_message_completedByUserId')
    .on('message')
    .execute();
  await db.schema.dropIndex('idx_message_createdAt').on('message').execute();
  await db.schema.dropIndex('idx_message_isCompleted').on('message').execute();
  await db.schema
    .dropIndex('idx_message_completedBySection')
    .on('message')
    .execute();
  await db.schema
    .dropIndex('idx_message_parentMessageId')
    .on('message')
    .execute();
  await db.schema.dropIndex('idx_message_docketNumber').on('message').execute();
}
