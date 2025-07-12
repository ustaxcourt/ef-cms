import { getDbWriter } from '@web-api/persistence/postgres/database';
import { Database } from '@web-api/persistence/postgres/database-schema';
import { OPENSEARCH_SYNC_ACTIONS } from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { getColumnsForTable } from '@web-api/persistence/postgres/utils/getColumnsForTable';
import { AnyColumn } from 'kysely';
import { InsertExpression } from 'kysely/dist/cjs/parser/insert-values-parser';
import { isEmpty } from 'lodash';

export const pgInsertInto = async <T extends keyof Database>({
  table,
  values,
  onConflictColumns = [],
}: {
  table: T;
  values: InsertExpression<Database, T>;
  onConflictColumns?: AnyColumn<Database, T>[];
}) => {
  if (isEmpty(values)) {
    return [];
  }

  return await getDbWriter({
    cb: async writer => {
      let query = writer.insertInto(table).values(values);

      if (onConflictColumns.length > 0) {
        query = query.onConflict(oc =>
          oc.columns(onConflictColumns).doUpdateSet(c => {
            return Object.fromEntries(
              getColumnsForTable(table)
                .filter(x => !onConflictColumns.includes(x))
                .map(column => [
                  column,
                  // Needed for excluded.${column} to be dynamically filled in
                  // @ts-ignore
                  c.ref(`excluded.${column}`),
                ]),
            );
          }),
        );
      }

      return await query.returningAll().execute();
    },
    table,
    action: OPENSEARCH_SYNC_ACTIONS.UPSERT,
  });
};
