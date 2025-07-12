import { getDbReader } from '@web-api/persistence/postgres/database';
import { Database } from '@web-api/persistence/postgres/database-schema';
import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';
import type { Handler } from 'aws-lambda';

const TIME_TO_LIVE_COLUMN = 'ttl';

export const handler: Handler = async (_event, context) => {
  await getDbReader(async reader => {
    const ALL_TABLES = await reader.introspection.getTables();
    const TABLES_WITH_TTLS = ALL_TABLES.filter(tableMetaData => {
      return tableMetaData.columns.some(
        columnMetaData => columnMetaData.name === TIME_TO_LIVE_COLUMN,
      );
    });

    await Promise.all(
      TABLES_WITH_TTLS.map(async tableMetaData => {
        const { name: tableName } = tableMetaData;
        await pgDeleteFrom({
          table: tableName as keyof Database,
          where: (cb: any) =>
            cb.where(TIME_TO_LIVE_COLUMN, '<', Math.floor(Date.now() / 1000)),
        });
      }),
    );
  });

  context.succeed('Completed Cleanup!');
};
