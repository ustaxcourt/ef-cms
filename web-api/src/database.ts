import { Kysely } from 'kysely';
import { Database, DatabaseSchema } from './database-schema';
import { openSearchGateway } from '@web-api/gateways/openSearch/openSearchGateway';
import { formatNow } from '@shared/business/utilities/DateHandler';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import {
  OpenSearchSyncMessage,
  OpenSearchSyncMessageType,
} from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { getConnection } from '@web-api/getConnection';

export function getDbReader<T>(cb: (r: Kysely<Database>) => T): Promise<T> {
  return getConnection({
    cb,
  });
}

// Prefer pgInsertInto, pgUpdateTable, pgDeleteFrom, etc.
export async function getDbWriter<T>({
  cb,
  table,
}: {
  cb: (db: Kysely<Database>) => Promise<T>;
  table: keyof Database | null;
}): Promise<T> {
  if (!table || !DatabaseSchema[table].indexOpenSearchMessage) {
    return await getConnection({
      cb,
    });
  }

  const rawResult: T = await getConnection({
    cb,
  });

  let result: any = rawResult;
  if (DatabaseSchema[table].transformOpenSearchMessage) {
    result = DatabaseSchema[table].transformOpenSearchMessage(rawResult);
  }

  if (result) {
    try {
      const message: OpenSearchSyncMessage = {
        timestamp: formatNow(),
        payload: result,
        type: table as OpenSearchSyncMessageType,
      };

      await openSearchGateway().queueSync({ message });
    } catch (err) {
      getLogger().error(
        'Error queuing message for opensearch from postgres',
        err,
      );
    }
  }

  return rawResult;
}
