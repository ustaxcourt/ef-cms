import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwRequest')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('requestId', 'text', col => col.notNull())
    .addColumn('userId', 'text', col => col.notNull())
    .addColumn('status', 'text', col => col.notNull().defaultTo('pending'))
    .addColumn('totalChunks', 'integer', col => col.notNull().defaultTo(0))
    .addColumn('ttl', 'integer', col => col.notNull())
    .execute();

  await db.schema
    .createTable('dwResponseChunk')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('userId', 'text', col => col.notNull())
    .addColumn('requestId', 'text', col => col.notNull())
    .addColumn('chunk', 'text', col => col.notNull())
    .addColumn('index', 'integer', col => col.notNull())
    .addColumn('totalNumberOfChunks', 'integer', col => col.notNull())
    .addColumn('ttl', 'integer', col => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema
    .createIndex('idxRequestUserRequest')
    .on('dwRequest')
    .columns(['userId', 'requestId'])
    .unique()
    .execute();

  await db.schema
    .createIndex('idxResponseChunkUserRequest')
    .on('dwResponseChunk')
    .columns(['userId', 'requestId'])
    .execute();

  await db.schema
    .createIndex('idxResponseChunkUnique')
    .on('dwResponseChunk')
    .columns(['userId', 'requestId', 'index'])
    .unique()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwResponseChunk').execute();
  await db.schema.dropTable('dwRequest').execute();
}
