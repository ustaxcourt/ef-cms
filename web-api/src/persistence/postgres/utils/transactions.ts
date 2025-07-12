import { settlePromises } from '@web-api/utilities/settlePromises';
import { ConnectionStore, getConnection } from '@web-api/getConnection';

export async function withTransaction<T>(fn: () => Promise<T>): Promise<T> {
  // If we are already in a transaction, continue like normal.
  if (inTransaction()) return fn();

  const db = await getConnection();

  // Otherwise, we need to start a transaction. We let kysely take care of the begin/commit/rollback details
  return db.transaction().execute(async trx => {
    const store = {
      inTransaction: true,
      currentConnection: trx,
      onCommitCallbacks: [] as Array<() => Promise<void>>,
    };

    // Then we pass in information to any nested processes. If any fail, the whole transaction will fail.
    return ConnectionStore.run(store, async () => {
      const result = await fn();

      // At the end, we run all the things we need to do on commit, like indexing in OpenSearch.
      await settlePromises(store.onCommitCallbacks.map(cb => cb()));

      return result;
    });
  });
}

// Whether or not the caller is currently part of a transaction
export function inTransaction() {
  const store = ConnectionStore.getStore();
  return !!store && !!store.inTransaction;
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
