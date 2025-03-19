import { getDbWriter } from '@web-api/database';
import { Database, DatabaseTableName } from '@web-api/database-types';
import { UpdateQueryBuilder } from 'kysely';

type UpdateWhereCallback<T extends keyof Database> = (
  qb: UpdateQueryBuilder<Database, T, DatabaseTableName, unknown>,
) => UpdateQueryBuilder<Database, T, DatabaseTableName, unknown>;

export const pgUpdateTable = async <T extends keyof Database>({
  table,
  values,
  where,
}: {
  table: DatabaseTableName;
  values: Record<string, unknown>;
  where: UpdateWhereCallback<T>;
}) => {
  return await getDbWriter({
    cb: async writer => {
      const query = writer.updateTable(table).set(values);
      return await where(query).returningAll().execute();
    },
    table,
  });
};
