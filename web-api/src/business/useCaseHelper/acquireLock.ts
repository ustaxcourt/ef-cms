import { ALLOWLIST_FEATURE_FLAGS } from '../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { sleep } from '@shared/tools/helpers';

export const checkLock = async ({
  applicationContext,
  identifier,
}: {
  applicationContext: ServerApplicationContext;
  identifier: string;
}): Promise<boolean> => {
  const featureFlags = await applicationContext
    .getUseCases()
    .getAllFeatureFlagsInteractor(applicationContext);

  const isCaseLockingEnabled =
    featureFlags[ALLOWLIST_FEATURE_FLAGS.ENTITY_LOCKING_FEATURE_FLAG.key];

  const currentLock = await applicationContext
    .getPersistenceGateway()
    .getLock({ applicationContext, identifier });

  if (!currentLock) {
    getDawsonLogger().warn('Entity is NOT currently locked', { identifier });
    return false;
  }

  getDawsonLogger().warn('Entity is currently locked', { currentLock });

  if (!isCaseLockingEnabled) {
    return false;
  }

  return true;
};

export const acquireLock = async ({
  applicationContext,
  authorizedUser,
  identifiers = [],
  onLockError,
  options = {},
  retries = 0,
  ttl = 30,
  waitTime = 3000,
}: {
  applicationContext: ServerApplicationContext;
  identifiers?: string[];
  onLockError?: TOnLockError;
  options?: any;
  retries?: number;
  ttl?: number;
  waitTime?: number;
  authorizedUser: UnknownAuthUser;
}): Promise<void> => {
  if (!identifiers) {
    return;
  }
  let attempts = 0;
  let hasLockedItems = true;
  do {
    if (attempts > retries) {
      if (onLockError instanceof Error) {
        throw onLockError;
      } else if (typeof onLockError === 'function') {
        await onLockError(applicationContext, options, authorizedUser);
      }
      throw new ServiceUnavailableError(
        'One of the items you are trying to update is being updated by someone else',
      );
    }

    if (attempts > 0) {
      await sleep(waitTime);
    }

    const results = await Promise.all(
      identifiers.map(entityIdentifier =>
        checkLock({ applicationContext, identifier: entityIdentifier }),
      ),
    );

    hasLockedItems = results.some(isLocked => isLocked);
    attempts++;
  } while (hasLockedItems);

  // Second, lock them up so the are unavailable
  await Promise.all(
    identifiers.map(entityIdentifier =>
      applicationContext
        .getPersistenceGateway()
        .createLock({ applicationContext, identifier: entityIdentifier, ttl }),
    ),
  );
};

export const removeLock = ({
  applicationContext,
  identifiers = [],
}: {
  applicationContext: ServerApplicationContext;
  identifiers: string[];
}): Promise<void> => {
  return applicationContext
    .getPersistenceGateway()
    .removeLock({ applicationContext, identifiers });
};

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

/**
 * will wrap a function with logic to acquire a lock and delete a lock after finishing.
 * @param {function} interactor the original function to wrap
 * @param {function} getLockInfo a function which is passes the original args for getting the lock suffix
 * @param {error} onLockError the error object to throw if a lock is already in use
 * @returns {object} the item that was retrieved
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
  ) =>
    | Promise<{ identifiers: string[]; ttl?: number }>
    | { identifiers: string[]; ttl?: number },
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
    const { identifiers, ttl } = await getLockInfo(
      applicationContext,
      options,
      authorizedUser,
    );

    await acquireLock({
      applicationContext,
      authorizedUser,
      identifiers,
      onLockError,
      options,
      ttl,
    });

    let caughtError;
    let results: InteractorOutput;
    try {
      results = await interactor(applicationContext, options, authorizedUser);
    } catch (err) {
      caughtError = err;
    }

    await removeLock({ applicationContext, identifiers });

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
