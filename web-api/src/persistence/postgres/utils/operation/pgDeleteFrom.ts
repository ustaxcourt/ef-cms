import { getDbWriter } from '@web-api/database';
import { Database, DatabaseTableName } from '@web-api/database-types';
import { DeleteQueryBuilder } from 'kysely';

type DeleteWhereCallback = (
  qb: DeleteQueryBuilder<Database, DatabaseTableName, unknown>,
) => DeleteQueryBuilder<Database, DatabaseTableName, unknown>;

export const pgDeleteFrom = async ({
  table,
  where,
}: {
  table: DatabaseTableName;
  where: DeleteWhereCallback;
}) => {
  return await getDbWriter({
    cb: async writer => {
      const query = writer.deleteFrom(table);
      return await where(query).returningAll().execute();
    },
    table: null,
  });
};
