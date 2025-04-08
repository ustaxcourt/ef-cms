import { getDbWriter } from '@web-api/database';
import { Database } from '@web-api/database-schema';
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
  });
};
