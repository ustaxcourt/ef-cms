import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Create requests table
  await db.schema
    .createTable('requests')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('requestId', 'text', col => col.notNull())
    .addColumn('userId', 'text', col => col.notNull())
    .addColumn('status', 'text', col => col.notNull().defaultTo('pending'))
    .addColumn('totalChunks', 'integer', col => col.notNull().defaultTo(0))
    .addColumn('createdAt', 'timestamptz', col => col.notNull())
    .execute();

  // Create response_chunks table
  await db.schema
    .createTable('response_chunks')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('userId', 'text', col => col.notNull())
    .addColumn('requestId', 'text', col => col.notNull())
    .addColumn('chunk', 'text', col => col.notNull())
    .addColumn('index', 'integer', col => col.notNull())
    .addColumn('totalNumberOfChunks', 'integer', col => col.notNull())
    .addColumn('createdAt', 'timestamptz', col =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  // Add indexes for efficient queries
  await db.schema
    .createIndex('idx_requests_user_request')
    .on('requests')
    .columns(['userId', 'requestId'])
    .unique()
    .execute();

  await db.schema
    .createIndex('idx_response_chunks_user_request')
    .on('response_chunks')
    .columns(['userId', 'requestId'])
    .execute();

  await db.schema
    .createIndex('idx_response_chunks_unique')
    .on('response_chunks')
    .columns(['userId', 'requestId', 'index'])
    .unique()
    .execute();

  // Add TTL implementation (could use a scheduled job or Postgres extension)
  // For PostgreSQL 14+, you could use pg_cron to periodically clean up old records
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('response_chunks').execute();
  await db.schema.dropTable('requests').execute();
}
