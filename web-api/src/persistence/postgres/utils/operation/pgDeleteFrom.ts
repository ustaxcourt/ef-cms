import { getDbWriter } from '@web-api/persistence/postgres/database';
import { Database } from '@web-api/persistence/postgres/database-schema';
import { OPENSEARCH_SYNC_ACTIONS } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { DeleteQueryBuilder, DeleteResult } from 'kysely';
import { DeleteFrom } from 'kysely/dist/cjs/parser/delete-from-parser';

type DeleteWhereCallback<T extends keyof Database> = (
  qb: DeleteFrom<Database, T>,
) => DeleteQueryBuilder<Database, T, DeleteResult>;

export const pgDeleteFrom = async <T extends keyof Database>({
  table,
  where,
}: {
  table: T;
  where: DeleteWhereCallback<T>;
}) => {
  return await getDbWriter({
    cb: async writer => {
      const query = writer.deleteFrom(table);
      return await where(query).returningAll().execute();
    },
    table,
    action: OPENSEARCH_SYNC_ACTIONS.DELETE,
  });
};
