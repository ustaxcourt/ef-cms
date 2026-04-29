import { Kysely, sql } from 'kysely';
import { getDbWriter } from '@web-api/database';

/**
 * Tables that must NOT be truncated. `dw_feature_flag` carries application
 * configuration that must survive a data wipe; the `kysely_migration` and
 * `kysely_migration_lock` tables track which migrations have run and must
 * never be cleared, lest the next migration attempt rerun every migration.
 */
export const PRESERVED_TABLES: string[] = [
  'dw_feature_flag',
  'kysely_migration',
  'kysely_migration_lock',
];

/**
 * Returns the names of all user tables in the `public` schema, excluding the
 * tables that must be preserved. Tables are discovered dynamically via
 * `information_schema.tables` so this script does not need to be updated as
 * new tables and relationships are added over time.
 */
export const getTruncatableTables = async ({
  db,
}: {
  db: Kysely<any>;
}): Promise<string[]> => {
  const result = await sql<{ table_name: string }>`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `.execute(db);

  return result.rows
    .map(row => row.table_name)
    .filter(tableName => !PRESERVED_TABLES.includes(tableName));
};

/**
 * Truncates all DAWSON tables (other than the preserved ones) in a single
 * `TRUNCATE TABLE ... CASCADE` statement. Postgres' CASCADE option resolves
 * foreign key relationships automatically, so we don't have to maintain a
 * hand-curated truncation order.
 */
export const truncateAllPostgresTables = async (): Promise<string[]> => {
  return await getDbWriter({
    cb: async (db: Kysely<any>) => {
      const tables: string[] = await getTruncatableTables({ db });
      if (tables.length === 0) {
        console.log('No DAWSON tables found to truncate.');
        return tables;
      }

      const tableList = sql.join(tables.map(t => sql.id(t)));
      await sql`TRUNCATE TABLE ${tableList} CASCADE`.execute(db);

      console.log(`Truncated ${tables.length} table(s):`, tables.join(', '));
      return tables;
    },
    table: null,
    action: null,
  });
};
