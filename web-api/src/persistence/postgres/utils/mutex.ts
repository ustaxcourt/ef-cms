import { getDbWriter } from '@web-api/database';
import { CompiledQuery } from 'kysely';

export const CREATE_CASE_LOCK = 112358;

const MUTEX_NUM_ATTEMPTS = 5;
const RETRY_DELAY_MS = 100;

/**
 * Executes an asynchronous callback within a mutex lock to ensure exclusive access
 * to a critical section of code.
 *
 * This function acquires a mutex lock identified by `lockId` before invoking the
 * provided callback. It is designed to protect sensitive operations, such as assigning
 * the next available docket number when creating a case, from concurrent execution
 * across processes. Once the callback completes (whether it resolves successfully
 * or throws an error), the lock is released.
 *
 */
export const mutexLockWrapper = async <T>({
  lockId,
  callback,
}: {
  lockId: number;
  callback: () => Promise<T>;
}): Promise<T> => {
  await getLock({ lockId });
  try {
    return callback();
  } finally {
    // Ensure the lock is released regardless of the callback outcome.
    await releaseLock({ lockId });
  }
};

const getLock = async ({ lockId }: { lockId: number }) => {
  for (let i = 0; i < MUTEX_NUM_ATTEMPTS; i++) {
    if ((await tryGetLock({ lockId })) === true) {
      return; // We got the lock
    }
    // We did not get the lock, so try again
    await new Promise(
      resolve => setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, i)), // Exponential backoff
    );
  }
  throw new Error(`Could not obtain a lock for ${lockId}`);
};

const tryGetLock = async ({ lockId }: { lockId: number }) => {
  const gotLockResult = await getDbWriter({
    table: null,
    cb: async writer => {
      const result = await writer.executeQuery<{ pgTryAdvisoryLock: boolean }>(
        CompiledQuery.raw(`select pg_try_advisory_lock(${lockId})`, []),
      );
      return result;
    },
  });
  const gotLock = gotLockResult.rows[0].pgTryAdvisoryLock;
  return gotLock;
};

const releaseLock = async ({ lockId }: { lockId: number }) => {
  const releasedLockResult = await getDbWriter({
    table: null,
    cb: async writer => {
      const result = await writer.executeQuery<{ pgAdvisoryUnlock: boolean }>(
        CompiledQuery.raw(`select pg_advisory_unlock(${lockId})`, []),
      );
      return result;
    },
  });
  const releasedLock = releasedLockResult.rows[0].pgAdvisoryUnlock;
  return releasedLock;
};
