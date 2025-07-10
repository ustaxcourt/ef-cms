import { getDbReader } from '@web-api/database';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { CompiledQuery } from 'kysely';

let transactionInProgress: Promise<void> | null = null;
let transactionError: Error | null = null;
let count = 0;
let onCommitCallbacks: (() => Promise<void>)[] = [];

/**
 * Run a callback inside a transaction context.
 * Rolls back on any exception; otherwise commits when all nesting unwinds.
 * Note that the implementation only guarantees that the callback is committed together in *some*
 * transaction, not necessarily that it will be the only stuff committed/rolled back in the transaction.
 *
 * E.g., the following are essentially equivalent:
 * 1) await Promise.all([withTransaction(cb1), withTransaction(cb2)]));
 * 2) await withTransaction(() => Promise.all([cb1, cb2]))
 *
 *
 * THIS IS NOT IDEAL. However, without fiddling with connections or setting up the transaction
 * at a per-lambda invocation, which limits granularity, this is the best compromise I could come up with.
 */
export async function withTransaction<T>(
  callback: () => Promise<T>,
): Promise<T> {
  await startTransaction();
  try {
    const result = await callback();
    await endTransaction();
    return result;
  } catch (e) {
    // propagate the rollback, then rethrow so callers know it failed
    await endTransaction(e as Error);
    throw e;
  }
}

export function onTransactionCommit(cb: () => Promise<void>) {
  // Add a callback to run when the transaction is committed
  if (transactionInProgress) {
    onCommitCallbacks.push(cb);
  } else {
    throw new Error(
      'onTransactionCommit was called without an ongoing transaction',
    );
  }
}

export function inTransaction() {
  return !!transactionInProgress;
}

// Clear all transaction state
export function resetTransaction(): void {
  transactionInProgress = null;
  transactionError = null;
  count = 0;
  onCommitCallbacks = [];
}

export async function startTransaction(): Promise<void> {
  count += 1;
  if (!transactionInProgress) {
    // Mark transactionInProgress before sending BEGIN, so overlapping calls wait on the same promise
    // Otherwise multiple promises could all try to start/end transactions arbitrarily
    transactionInProgress = (async () => {
      await getDbReader(r => r.executeQuery(CompiledQuery.raw(`BEGIN`)));
    })();
  }
  // wait for the BEGIN to be acknowledged
  await transactionInProgress;
}

export async function endTransaction(err: Error | null = null): Promise<void> {
  count -= 1;
  if (err && !transactionError) {
    // We set the transaction error as the first error that occurred
    transactionError = err;
  }
  if (transactionError) {
    if (count === 0) {
      await getDbReader(r => r.executeQuery(CompiledQuery.raw(`ROLLBACK`)));
      resetTransaction();
    }
    return;
  }
  // only commit when outermost call unwinds and no error occurred
  if (count === 0 && transactionInProgress) {
    await getDbReader(r => r.executeQuery(CompiledQuery.raw(`COMMIT`)));
    await settlePromises(onCommitCallbacks.map(cb => cb()));
    resetTransaction();
  }
}
