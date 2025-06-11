import { Kysely } from 'kysely';

const requestsTableUserRequestIndex = 'idx_requests_user_request';
const requestsTableTTLIndex = 'idx_requests_ttl';
const responseChunksTableUserRequestIndex = 'idx_response_chunks_user_request';
const responseChunksTableUniqueIndex = 'idx_response_chunks_unique';
const responseChunksTableTTLIndex = 'idx_response_chunks_ttl';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwRequest')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('requestId', 'varchar', col => col.notNull())
    .addColumn('userId', 'varchar', col => col.notNull())
    .addColumn('totalChunks', 'integer', col => col.notNull().defaultTo(0))
    .addColumn('ttl', 'bigint', col => col.notNull())
    .execute();

  await db.schema
    .createTable('dwResponseChunk')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('userId', 'varchar', col => col.notNull())
    .addColumn('requestId', 'varchar', col => col.notNull())
    .addColumn('chunk', 'text', col => col.notNull())
    .addColumn('index', 'integer', col => col.notNull())
    .addColumn('totalNumberOfChunks', 'integer', col => col.notNull())
    .addColumn('ttl', 'bigint', col => col.notNull())
    .execute();

  await db.schema
    .createIndex('idx_requests_user_request')
    .on('dwRequest')
    .columns(['userId', 'requestId'])
    .unique()
    .execute();

  await db.schema
    .createIndex('idx_requests_ttl')
    .on('dwRequest')
    .column('ttl')
    .execute();

  await db.schema
    .createIndex('idx_response_chunks_user_request')
    .on('dwResponseChunk')
    .columns(['userId', 'requestId'])
    .execute();

  await db.schema
    .createIndex('idx_response_chunks_unique')
    .on('dwResponseChunk')
    .columns(['userId', 'requestId', 'index'])
    .unique()
    .execute();

  await db.schema
    .createIndex('idx_response_chunks_ttl')
    .on('dwResponseChunk')
    .column('ttl')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex(requestsTableUserRequestIndex).execute();
  await db.schema.dropIndex(requestsTableTTLIndex).execute();
  await db.schema.dropIndex(responseChunksTableUserRequestIndex).execute();
  await db.schema.dropIndex(responseChunksTableUniqueIndex).execute();
  await db.schema.dropIndex(responseChunksTableTTLIndex).execute();

  await db.schema.dropTable('dwResponseChunk').execute();
  await db.schema.dropTable('dwRequest').execute();
}
