import crypto from 'crypto';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { tryGetLocks } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { sleep } from '@shared/tools/helpers';
import { acquireOneDbConnection } from '@web-api/persistence/postgres/acquireOneDbConnection';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { tryReleaseLocks } from '@web-api/persistence/postgres/utils/operation/tryReleaseLocks';

/**
 * Converts a string into a consistent 32-bit integer to use as an advisory lock ID.
 */
export const hashLockId = (input: string): number => {
  const hash = crypto.createHash('sha256').update(input).digest();
  return hash.readInt32BE(0);
};

/**
 * Attempts to acquire advisory locks for a set of identifiers, using retries if necessary.
 * Locks are tied to a scoped DB connection and must be released by the returned function (or will be
 * released when the scoped db connection is terminated).
 * Returns a lock removal function to release locks and destroy scoped connection when no longer needed.
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
  if (!identifiers.length) {
    return async () => {}; // No-op since we never need to create the scoped connection
  }

  // We get a single connection and use that for the lifetime of the lock since pg_advisory_lock needs to be opened/closed by the same connection
  const connection = await acquireOneDbConnection();

  let attempts = 0;
  let lockedItems: string[] = [];

  do {
    if (attempts > retries) {
      if (onLockError instanceof Error) {
        throw onLockError;
      } else if (typeof onLockError === 'function') {
        await onLockError(applicationContext, options, authorizedUser);
      }
      throw new ServiceUnavailableError(
        `One of the items you are trying to update is being updated by someone else: ${lockedItems.join(', ')}`,
      );
    }

    if (attempts > 0) {
      await sleep(waitTime);
    }

    const results = await tryGetLocks({ connection, identifiers });

    lockedItems = results
      .filter(r => !r.successfullyLocked)
      .map(r => r.identifier);

    attempts++;
  } while (lockedItems.length);

  const removeLockFunction = async () => {
    return tryReleaseLocks({ connection, identifiers });
  };

  return removeLockFunction;
};

/**
 * Executes an asynchronous callback within a mutex lock to ensure exclusive access
 * to a critical section of code.
 *
 * This function acquires a mutex lock identified by `lockId` before invoking the
 * provided callback. It is designed to protect sensitive operations from concurrent execution
 * across processes. Once the callback completes (whether it resolves successfully
 * or throws an error), the lock is released.
 *
 */
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
      getDawsonLogger().error(
        `withLocking: failed to execute interactor: ${err}`,
      );
      caughtError = err;
    }

    try {
      await releaseLockFn();
    } catch (e) {
      getDawsonLogger().error(`withLocking: failed to remove lock: ${e}`);
      throw e;
    }
    if (caughtError) {
      throw caughtError;
    }

    return results!;
  };
}

export const asyncHandleLockError = async (
  applicationContext: ServerApplicationContext,
  { clientConnectionId }: { clientConnectionId?: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!authorizedUser?.userId || !clientConnectionId) return;
  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: { action: 'async_service_unavailable_error' },
    userId: authorizedUser?.userId,
  });
};

export type TOnLockError =
  | Error
  | ((
      applicationContext: any,
      originalRequest: any,
      authorizedUser: UnknownAuthUser,
    ) => void);
