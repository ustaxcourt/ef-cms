import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Index for docketNumber
  await db.schema
    .createIndex('idx_workItem_docketNumber')
    .on('dwWorkItem')
    .column('docketNumber')
    .execute();

  // Index for section
  await db.schema
    .createIndex('idx_workItem_section')
    .on('dwWorkItem')
    .column('section')
    .execute();

  // Index for completedAt
  await db.schema
    .createIndex('idx_workItem_completedAt')
    .on('dwWorkItem')
    .column('completedAt')
    .execute();

  // Index for createdAt
  await db.schema
    .createIndex('idx_workItem_createdAt')
    .on('dwWorkItem')
    .column('createdAt')
    .execute();

  // Index for highPriority
  await db.schema
    .createIndex('idx_workItem_highPriority')
    .on('dwWorkItem')
    .column('highPriority')
    .execute();

  // Index for assigneeId
  await db.schema
    .createIndex('idx_workItem_assigneeId')
    .on('dwWorkItem')
    .column('assigneeId')
    .execute();

  // Index for associatedJudge
  await db.schema
    .createIndex('idx_workItem_associatedJudge')
    .on('dwWorkItem')
    .column('associatedJudge')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop indexes in reverse order to ensure clean rollback
  await db.schema
    .dropIndex('idx_workItem_associatedJudge')
    .execute();
  await db.schema
    .dropIndex('idx_workItem_assigneeId')
    .execute();
  await db.schema
    .dropIndex('idx_workItem_highPriority')
    .execute();

  await db.schema
    .dropIndex('idx_workItem_createdAt')
    .execute();
  await db.schema
    .dropIndex('idx_workItem_completedAt')
    .execute();
  await db.schema.dropIndex('idx_workItem_section').on('dwWorkItem').execute();
  await db.schema
    .dropIndex('idx_workItem_docketNumber')
    .execute();
}
