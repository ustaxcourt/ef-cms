import { Kysely } from 'kysely';
import { Database, DatabaseSchema } from './database-schema';
import { openSearchGateway } from '@web-api/gateways/openSearch/openSearchGateway';
import { formatNow } from '@shared/business/utilities/DateHandler';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import {
  OpenSearchSyncAction,
  OpenSearchSyncMessage,
  OpenSearchSyncMessageType,
} from '@web-api/lambdas/openSearch/openSearchSyncHandler';
import { getConnection } from '@web-api/getConnection';
import {
  inTransaction,
  onTransactionCommit,
} from '@web-api/persistence/postgres/utils/transactions';

export function getDbReader<T>(cb: (r: Kysely<Database>) => T): Promise<T> {
  return getConnection({
    cb,
  });
}

// Prefer pgInsertInto, pgUpdateTable, pgDeleteFrom, etc.
export async function getDbWriter<T>({
  cb,
  table,
  action,
}: {
  cb: (db: Kysely<Database>) => Promise<T>;
  table: keyof Database | null;
  action: OpenSearchSyncAction | null;
}): Promise<T> {
  const writeDoesNotNeedToBeIndexedInOpenSearch =
    !table || !DatabaseSchema[table].indexOpenSearchMessage || !action;
  if (writeDoesNotNeedToBeIndexedInOpenSearch) {
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
        action,
      };
      await syncWriteToOpenSearch(message);
    } catch (err) {
      getDawsonLogger().error(
        'Error queuing message for opensearch from postgres',
        err,
      );
    }
  }

  return rawResult;
}

async function syncWriteToOpenSearch(message: OpenSearchSyncMessage) {
  const syncFunc = async () => openSearchGateway().queueSync({ message });
  if (!inTransaction()) {
    // If we are not in a transaction, go ahead and send the message to OpenSearch directly.
    await syncFunc();
  } else {
    // Otherwise, add it as a callback to be run if the transaction is successful.
    onTransactionCommit(syncFunc);
  }
}
