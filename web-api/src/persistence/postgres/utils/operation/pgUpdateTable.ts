import { getDbWriter } from '@web-api/database';
import { Database } from '@web-api/database-schema';
import { OPENSEARCH_SYNC_ACTIONS } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { UpdateQueryBuilder, UpdateResult } from 'kysely';
import { ExtractTableAlias } from 'kysely/dist/cjs/parser/table-parser';
import { UpdateObjectExpression } from 'kysely/dist/cjs/parser/update-set-parser';

type UpdateWhereCallback<T extends keyof Database> = (
  qb: UpdateQueryBuilder<
    Database,
    ExtractTableAlias<Database, T>,
    ExtractTableAlias<Database, T>,
    UpdateResult
  >,
) => UpdateQueryBuilder<
  Database,
  ExtractTableAlias<Database, T>,
  ExtractTableAlias<Database, T>,
  UpdateResult
>;

// Note that an undefined value will NOT overwrite the existing value in the database.
// If you need to overwrite the existing value, use pgInstertInto with onConflictColumns specified.
export const pgUpdateTable = async <T extends keyof Database>({
  table,
  values,
  where,
}: {
  table: T;
  values: UpdateObjectExpression<
    Database,
    ExtractTableAlias<Database, T>,
    ExtractTableAlias<Database, T>
  >;
  where: UpdateWhereCallback<T>;
}) => {
  return await getDbWriter({
    cb: async writer => {
      const query = writer.updateTable(table).set(values);
      return await where(query).returningAll().execute();
    },
    table,
    action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
  });
};
