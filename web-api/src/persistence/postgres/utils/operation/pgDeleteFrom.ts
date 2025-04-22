import { getDbWriter } from '@web-api/database';
import { Database } from '@web-api/database-schema';
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
    table: null,
  });
};
