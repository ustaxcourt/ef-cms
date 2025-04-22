import { getDbWriter } from '@web-api/database';
import { Database } from '@web-api/database-schema';
import { DeleteQueryBuilder, DeleteResult } from 'kysely';
import { ExtractTableAlias } from 'kysely/dist/cjs/parser/table-parser';

type DeleteWhereCallback<T extends keyof Database> = (
  qb: DeleteQueryBuilder<
    Database,
    ExtractTableAlias<Database, T>,
    DeleteResult
  >,
) => DeleteQueryBuilder<Database, ExtractTableAlias<Database, T>, DeleteResult>;

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
      // @ts-ignore 10502 temp ignore while cases is going to test
      return await where(query).returningAll().execute();
    },
    table: null,
  });
};
