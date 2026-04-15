import { getDbReader } from '@web-api/database';
import { Database } from '@web-api/database-schema';
import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';
import type { Handler } from 'aws-lambda';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { camelCase } from 'lodash';

const TIME_TO_LIVE_COLUMN = 'ttl';

export const handler: Handler = async (_event, _context) => {
  if (process.env.READ_ONLY_MODE === 'true') {
    console.log('Read-only mode is engaged. Skipping expiration cleanup.')
    return;
  }

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
        const nowSeconds = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
        await pgDeleteFrom({
          table: camelCase(tableName) as keyof Database,
          where: (cb: any) => cb.where(TIME_TO_LIVE_COLUMN, '<', nowSeconds),
        });
      }),
    );
  });

  console.log('Completed Cleanup!');
};
