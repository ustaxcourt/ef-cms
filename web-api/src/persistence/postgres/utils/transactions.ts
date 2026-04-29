import { settlePromises } from '@web-api/utilities/settlePromises';
import {
  ConnectionInfo,
  ConnectionStore,
  getDb,
} from '@web-api/persistence/postgres/databaseConnection';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import {
  createISODateString,
  dateStringsCompared,
} from '@shared/business/utilities/DateHandler';

export async function withTransaction<T>(fn: () => Promise<T>): Promise<T> {
  // If we're already in a transaction, just run the callback directly.
  if (inTransaction()) {
    return fn();
  }

  const db = await getDb();

  // We'll capture the store here so it's available after commit.
  let transactionStore: ConnectionInfo = {} as ConnectionInfo;

  // Start the transaction; Kysely handles BEGIN/COMMIT/ROLLBACK.
  const transactionStartTime = createISODateString();
  const result = await db.transaction().execute(async trx => {
    // Initialize store for this transaction.
    transactionStore = {
      currentTransaction: trx,
      onCommitCallbacks: [] as Array<() => Promise<void>>,
    };

    // Run the user-supplied function within the transaction context.
    return ConnectionStore.run(transactionStore, () => fn());
  });
  const transactionEndTime = createISODateString();
  const timeRan = dateStringsCompared(transactionEndTime, transactionStartTime, {
    exact: true,
  });
  getDawsonLogger().info(`Transaction ran for: ${timeRan} milliseconds`);

  // After the transaction completes successfully, run the onCommit callbacks.
  if (transactionStore.onCommitCallbacks?.length) {
    try {
      await settlePromises(transactionStore.onCommitCallbacks.map(cb => cb()));
    } catch (error: any) {
      getDawsonLogger().error(
        'There was an error running onCommitCallbacks',
        error,
      );
    }
  }

  return result;
}

// Whether or not the caller is currently part of a transaction
export function inTransaction() {
  const store = ConnectionStore.getStore();
  return !!store && !!store.currentTransaction;
}

// Callbacks to run once the commit is successful
export function onTransactionCommit(cb: () => Promise<void>) {
  const store = ConnectionStore.getStore();
  if (store && store.onCommitCallbacks) {
    store.onCommitCallbacks.push(cb);
  } else {
    throw new Error(
      'onTransactionCommit was called without an ongoing transaction',
    );
  }
}
