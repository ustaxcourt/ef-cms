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
  const timeRan = dateStringsCompared(
    transactionEndTime,
    transactionStartTime,
    {
      exact: true,
    },
  );
  if (timeRan >= 500) {
    getDawsonLogger().info(`Transaction ran for: ${timeRan} milliseconds`);
  }

  // After the transaction completes successfully, run the onCommit callbacks.
  // We chunk the callbacks to avoid overwhelming downstream services (e.g., SQS,
  // OpenSearch) when a transaction has registered many post-commit hooks. SQS
  // SendMessageBatch has a hard limit of 10 messages, but our queueSync calls
  // are individual SendMessage calls; a chunk size of 25 keeps fan-out modest
  // without significantly slowing the small-N case.
  if (transactionStore.onCommitCallbacks?.length) {
    const callbacks = transactionStore.onCommitCallbacks;
    const ON_COMMIT_CHUNK_SIZE = 25;
    for (let i = 0; i < callbacks.length; i += ON_COMMIT_CHUNK_SIZE) {
      const chunk = callbacks.slice(i, i + ON_COMMIT_CHUNK_SIZE);
      try {
        await settlePromises(chunk.map(cb => cb()));
      } catch (error: any) {
        getDawsonLogger().error(
          'There was an error running onCommitCallbacks',
          error,
        );
      }
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
