import { getDbReader } from '@web-api/database';
import { CompiledQuery } from 'kysely';

import { AsyncLocalStorage } from 'async_hooks';
import { settlePromises } from '@web-api/utilities/settlePromises';

type TransactionStore = {
  inTransaction: boolean;
  onCommitCallbacks?: (() => Promise<void>)[];
};

// We use this to keep track of per-promise savepoints and to pass context through nested promises
const als = new AsyncLocalStorage<TransactionStore>();

// Whether or not the caller is currently part of a transaction
export function inTransaction() {
  const store = als.getStore();
  return !!(store && store.inTransaction);
}

// Callbacks to run once the commit is successful
export function onTransactionCommit(cb: () => Promise<void>) {
  // Add a callback to run when the transaction is committed
  const store = als.getStore();
  if (store && store.onCommitCallbacks) {
    store.onCommitCallbacks.push(cb);
  } else {
    throw new Error('onTransactionCommit was called without an ongoing transaction')
  }
}

// A wrapper to keep everything within it scoped to a transaction
export async function withTransaction<T>(fn: () => Promise<T>): Promise<T> {
  const store = als.getStore();

  // If we are already in a transaction, we will spin up a unique, per-promise savepoint
  if (store && store.inTransaction) {
    const sp = `sp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await getDbReader(reader =>
      reader.executeQuery(CompiledQuery.raw(`SAVEPOINT ${sp}`)),
    );
    try {
      const result = await fn();
      await getDbReader(reader =>
        reader.executeQuery(CompiledQuery.raw(`RELEASE SAVEPOINT ${sp}`)),
      );
      return result;
    } catch (err) {
      await getDbReader(reader =>
        reader.executeQuery(CompiledQuery.raw(`ROLLBACK TO SAVEPOINT ${sp}`)),
      );

      throw err;
    }
  }

  // Otherwise, we will start an honest-to-goodness transaction.
  // Nested transactions will be savepoints within it.
  // If any fails, then then the whole transaction will fail.
  const rootStore = {
    inTransaction: true,
    onCommitCallbacks: [] as (() => Promise<void>)[],
  };
  return await als.run(rootStore, async () => {
    try {
      await getDbReader(reader =>
        reader.executeQuery(CompiledQuery.raw(`BEGIN`)),
      );
      const result = await fn();
      await getDbReader(reader =>
        reader.executeQuery(CompiledQuery.raw(`COMMIT`)),
      );
      await settlePromises(rootStore.onCommitCallbacks.map(cb => cb()));
      return result;
    } catch (err) {
      await getDbReader(reader =>
        reader.executeQuery(CompiledQuery.raw(`ROLLBACK`)),
      );
      throw err;
    }
  });
}
