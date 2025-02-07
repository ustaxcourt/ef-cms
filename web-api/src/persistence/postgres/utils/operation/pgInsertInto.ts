import { getDbWriter } from '@web-api/database';
import { Database, DatabaseTableName } from '@web-api/database-types';
import { getColumnsForTable } from '@web-api/persistence/postgres/utils/getColumnsForTable';
import { AnyColumn } from 'kysely';
import { isEmpty } from 'lodash';

export const pgInsertInto = async ({
  table,
  values,
  onConflictColumns = [],
}: {
  table: DatabaseTableName;
  values: Record<string, unknown>[];
  onConflictColumns?: AnyColumn<Database, keyof Database>[];
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
  });
};
