import { getDbReader } from '@web-api/database';
import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';
import type { Handler } from 'aws-lambda';

const EXPIRATION_COLUMN = 'expiration_date';

export const handler: Handler = async (_event, context) => {
  await getDbReader(async reader => {
    const ALL_TABLES = await reader.introspection.getTables();
    const TABLES_WITH_EXPIRATIONS = ALL_TABLES.filter(tableMetaData => {
      return tableMetaData.columns.some(
        columnMetaData => columnMetaData.name === EXPIRATION_COLUMN,
      );
    });

    await Promise.all(
      TABLES_WITH_EXPIRATIONS.map(tableMetaData => async () => {
        const { name: tableName } = tableMetaData;
        await pgDeleteFrom({
          // fix the type
          table: tableName as any,
          where: cb =>
            cb.where(EXPIRATION_COLUMN, '<', Math.floor(Date.now() / 1000)),
        });
      }),
    );
  });
  context.succeed('Completed Cleanup!');
};
