import { getDbWriter } from '@web-api/database';
import { CompiledQuery } from 'kysely';
import crypto from 'crypto';
import { TOnLockError } from '@web-api/business/useCaseHelper/acquireLock';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getLogger } from '@web-api/utilities/logger/getLogger';

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
export const acquireLock = async ({
  applicationContext,
  identifierObjects,
  onLockError,
  options = {},
  authorizedUser,
}: {
  applicationContext: ServerApplicationContext;
  identifierObjects: { lockId: string; hashedLockId }[];
  onLockError?: TOnLockError;
  options?: any;
  authorizedUser: UnknownAuthUser;
}): Promise<void> => {
  let attempts = 0;
  let lockedItems: string[] = [];

  do {
    if (attempts > MUTEX_NUM_ATTEMPTS) {
      if (onLockError instanceof Error) {
        throw onLockError;
      } else if (typeof onLockError === 'function') {
        await onLockError(applicationContext, options, authorizedUser);
      }
      throw new Error( // this ain't great logging
        `One of the items you are trying to update is being updated by someone else: ${lockedItems.join(', ')}`,
      );
    }

    if (attempts > 0) {
      await new Promise(resolve =>
        setTimeout(resolve, RETRY_DELAY_MS * Math.pow(1.5, attempts - 1)),
      );
    }

    const results = await Promise.all(
      identifierObjects.map(async idObj => ({
        lockId: idObj.lockId,
        isLocked: !(await tryGetLock(idObj.hashedLockId)),
      })),
    );

    lockedItems = results.filter(r => r.isLocked).map(r => r.lockId);

    attempts++;
  } while (lockedItems.length || attempts === 0);
};

export const removeLock = async (
  identifierObjects: { lockId: string; hashedLockId: number }[],
): Promise<void> => {
  for (const idObj of [...identifierObjects].reverse()) {
    await releaseLock(idObj.hashedLockId);
  }
};

export function withLocking<InteractorInput, InteractorOutput>(
  interactor: (
    applicationContext: ServerApplicationContext,
    options: InteractorInput,
    authorizedUser: UnknownAuthUser,
  ) => Promise<InteractorOutput>,
  getLockInfo: (
    applicationContext: any,
    options: any,
    authorizedUser: UnknownAuthUser,
  ) => Promise<{ identifiers: string[] }> | { identifiers: string[] },
  onLockError?: TOnLockError,
): (
  applicationContext: any,
  options: InteractorInput,
  authorizedUser: UnknownAuthUser,
) => Promise<InteractorOutput> {
  return async function (
    applicationContext: ServerApplicationContext,
    options: InteractorInput,
    authorizedUser: UnknownAuthUser,
  ) {
    const { identifiers } = await getLockInfo(
      applicationContext,
      options,
      authorizedUser,
    );

    // consider moving so that acquireLock can be called independently
    const identifierObjects = identifiers.map(id => {
      return {
        lockId: id,
        hashedLockId: hashLockId(id),
      };
    });

    await acquireLock({
      applicationContext,
      identifierObjects,
      onLockError,
      options,
      authorizedUser,
    });

    let caughtError;
    let results: InteractorOutput;
    try {
      results = await interactor(applicationContext, options, authorizedUser);
    } catch (err) {
      getLogger().error(`withLocking: failed to execute interactor: ${err}`);
      caughtError = err;
    }

    try {
      await removeLock(identifierObjects);
    } catch (e) {
      getLogger().error(`withLocking: failed to remove lock: ${e}`);
      throw e;
    }
    if (caughtError) {
      throw caughtError;
    }

    return results!;
  };
}

const tryGetLock = async (lockId: number) => {
  const gotLockResult = await getDbWriter({
    table: null,
    cb: async writer => {
      const result = await writer.executeQuery<{ pgTryAdvisoryLock: boolean }>(
        CompiledQuery.raw(`select pg_try_advisory_lock(${lockId})`, []),
      );
      return result;
    },
  });
  return gotLockResult.rows[0].pgTryAdvisoryLock;
};

const releaseLock = async (lockId: number) => {
  const releasedLockResult = await getDbWriter({
    table: null,
    cb: async writer => {
      const result = await writer.executeQuery<{ pgAdvisoryUnlock: boolean }>(
        CompiledQuery.raw(`select pg_advisory_unlock(${lockId})`, []),
      );
      return result;
    },
  });
  return releasedLockResult.rows[0].pgAdvisoryUnlock;
};
