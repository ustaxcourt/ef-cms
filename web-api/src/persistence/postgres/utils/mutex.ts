import crypto from 'crypto';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { tryGetLock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { sleep } from '@shared/tools/helpers';
import { getScopedDbConnection } from '@web-api/getConnection';
import { settlePromises } from '@web-api/utilities/settlePromises';

/**
 * Converts a string into a consistent 32-bit integer to use as an advisory lock ID.
 */
export const hashLockId = (input: string): number => {
  const hash = crypto.createHash('sha256').update(input).digest();
  return hash.readInt32BE(0);
};

// nope!!!
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
  identifiers,
  onLockError,
  options = {},
  authorizedUser,
  retries = 0,
  waitTime = 3000,
}: {
  applicationContext: ServerApplicationContext;
  identifiers: string[];
  onLockError?: TOnLockError;
  options?: any;
  retries?: number;
  waitTime?: number;
  authorizedUser: UnknownAuthUser;
}): Promise<() => Promise<void>> => {
  // using a scoped connection ensures that the pg_try_advisory_locks are created and released on the same db connection
  const { db, destroy } = await getScopedDbConnection();

  let attempts = 0;
  let lockedItems: string[] = [];

  const identifierObjects = identifiers.map(id => ({
    lockId: id,
    hashedLockId: hashLockId(id),
  }));

  do {
    if (attempts > retries) {
      if (onLockError instanceof Error) {
        throw onLockError;
      } else if (typeof onLockError === 'function') {
        await onLockError(applicationContext, options, authorizedUser);
      }
      await destroy();
      throw new ServiceUnavailableError( // this ain't great logging
        `One of the items you are trying to update is being updated by someone else: ${lockedItems.join(', ')}`,
      );
    }

    if (attempts > 0) {
      await sleep(waitTime);
    }

    const results = await settlePromises(
      identifierObjects.map(async idObj => ({
        lockId: idObj.lockId,
        isLocked: !(await tryGetLock(db, idObj.hashedLockId)),
      })),
    );

    lockedItems = results.filter(r => r.isLocked).map(r => r.lockId);

    attempts++;
  } while (lockedItems.length);

  return async () => {
    // better logging on failure? Necessary if locks are connection-specific?
    await settlePromises(
      identifierObjects.map(idObj => releaseLock(db, idObj.hashedLockId)),
    );
    await destroy();
  };
};

export function withLocking<InteractorInput, InteractorOutput>(
  interactor: (
    applicationContext: any,
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
    applicationContext: any,
    options: InteractorInput,
    authorizedUser: UnknownAuthUser,
  ) {
    const { identifiers } = await getLockInfo(
      applicationContext,
      options,
      authorizedUser,
    );

    const releaseLockFn = await acquireLock({
      applicationContext,
      identifiers,
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
      await releaseLockFn();
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

export type TOnLockError =
  | Error
  | ((
      applicationContext: any,
      originalRequest: any,
      authorizedUser: UnknownAuthUser,
    ) => void);
