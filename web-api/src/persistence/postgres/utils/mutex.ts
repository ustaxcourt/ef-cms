import { getDbWriter } from '@web-api/database';
import { CompiledQuery } from 'kysely';
import crypto from 'crypto';

export const CREATE_CASE_LOCK = 112358;

const MUTEX_NUM_ATTEMPTS = 5;
const RETRY_DELAY_MS = 100;

/**
 * Converts a string into a consistent 32-bit integer to use as an advisory lock ID.
 */
export const hashLockId = (input: string): number => {
  const hash = crypto.createHash('sha256').update(input).digest();
  return hash.readInt32BE(0);
};

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

/**
 * Executes a callback while holding multiple advisory locks simultaneously.
 * Locks are acquired in the order provided and released in reverse order.
 */
export const multiMutexLockWrapper = async <T>({
  lockIds,
  callback,
}: {
  lockIds: number[];
  callback: () => Promise<T>;
}): Promise<T> => {
  for (const lockId of lockIds) {
    await getLock({ lockId });
  }

  try {
    return await callback();
  } finally {
    // Release locks in reverse order
    for (const lockId of lockIds.slice().reverse()) {
      await releaseLock({ lockId });
    }
  }
};
