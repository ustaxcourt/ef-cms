import { getDbReader } from '@web-api/database';
import { CompiledQuery } from 'kysely';

import { AsyncLocalStorage } from 'async_hooks';
import { settlePromises } from '@web-api/utilities/settlePromises';

export const TRANSACTION_LOCK_ID = 85939012019;

type TransactionStore = {
  inTransaction: boolean;
  onCommitCallbacks?: (() => Promise<void>)[];
};

/**
 * withTransaction is the heart of this file. How does it work?
 * Assuming one connection per lambda, we do the following:
 * 1) Wait for any existing transaction that is in progress on the connection via a lock.
 * 2) Start a new transaction.
 * 3) Run the callback, establishing a context for any child processes via AsyncLocalStorage. This is so that a nested transaction knows it is nested and does not wait for the lock.
 * 3) Commit or rollback.
 */

// We use this to keep track of whether a process is nested or parent-level
const als = new AsyncLocalStorage<TransactionStore>();

// Whether or not the caller is currently part of a transaction
export function inTransaction() {
  const store = als.getStore();
  return !!(store && store.inTransaction);
}

// Callbacks to run once the commit is successful
export function onTransactionCommit(cb: () => Promise<void>) {
  const store = als.getStore();
  if (store && store.onCommitCallbacks) {
    store.onCommitCallbacks.push(cb);
  } else {
    throw new Error(
      'onTransactionCommit was called without an ongoing transaction',
    );
  }
}

// A wrapper to keep everything within it scoped to a transaction
export async function withTransaction<T>(fn: () => Promise<T>): Promise<T> {
  const store = als.getStore();

  // If we are in a nested transaction, continue like normal and let the outer transaction handle commit/rollback.
  if (store && store.inTransaction) {
    return await fn();
  }

  // Otherwise, we need to start a new transaction.
  // Acquire a transaction lock so that only one transaction runs at a time.
  await getDbReader(reader =>
    reader.executeQuery(
      CompiledQuery.raw(`SELECT pg_advisory_xact_lock(${TRANSACTION_LOCK_ID})`),
    ),
  );

  // Then we pass in information to any nested processes. If any fail, the whole transaction will fail.
  const rootStore = {
    inTransaction: true,
    onCommitCallbacks: [] as (() => Promise<void>)[],
  };

  try {
    return await als.run(rootStore, async () => {
      await getDbReader(reader =>
        reader.executeQuery(CompiledQuery.raw(`BEGIN`)),
      );

      const result = await fn();

      await getDbReader(reader =>
        reader.executeQuery(CompiledQuery.raw(`COMMIT`)),
      );

      await settlePromises(rootStore.onCommitCallbacks.map(cb => cb()));
      return result;
    });
  } catch (err) {
    await getDbReader(reader =>
      reader.executeQuery(CompiledQuery.raw(`ROLLBACK`)),
    );
    throw err;
  }
}
