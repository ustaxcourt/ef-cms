import { getDbWriter } from '@web-api/database';
import { Database } from '@web-api/database-schema';
import { UpdateQueryBuilder, UpdateResult } from 'kysely';
import { UpdateObjectExpression } from 'kysely/dist/cjs/parser/update-set-parser';

type UpdateWhereCallback<T extends keyof Database> = (
  qb: UpdateQueryBuilder<Database, T, T, UpdateResult>,
) => UpdateQueryBuilder<Database, T, T, UpdateResult>;

export const pgUpdateTable = async <T extends keyof Database>({
  table,
  values,
  where,
}: {
  table: T;
  values: UpdateObjectExpression<Database, T, T>;
  where: UpdateWhereCallback<T>;
}) => {
  return await getDbWriter({
    table,
    cb: async writer => {

      // Kysely is not good at dynamically resolving tables, so we cast it here.
      const query = writer.updateTable(table) as UpdateQueryBuilder<
        Database,
        T,
        T,
        UpdateResult
      >;

      const queryWithValues = query.set(values);

      const result = await where(queryWithValues).returningAll().execute();
      return result;
    },
  });
};
