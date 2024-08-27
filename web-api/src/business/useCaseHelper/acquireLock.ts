import { ALLOWLIST_FEATURE_FLAGS } from '../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const checkLock = async ({
  applicationContext,
  authorizedUser,
  identifier,
  onLockError,
  options = {},
}: {
  authorizedUser: UnknownAuthUser;
  applicationContext: ServerApplicationContext;
  identifier: string;
  onLockError?: TOnLockError;
  options?: any;
}): Promise<void> => {
  const featureFlags = await applicationContext
    .getUseCases()
    .getAllFeatureFlagsInteractor(applicationContext);

  const isCaseLockingEnabled =
    featureFlags[ALLOWLIST_FEATURE_FLAGS.ENTITY_LOCKING_FEATURE_FLAG.key];

  const currentLock = await applicationContext
    .getPersistenceGateway()
    .getLock({ applicationContext, identifier });

  if (!currentLock) {
    applicationContext.logger.warn('Entity is NOT currently locked', {
      identifier,
    });
    return;
  }

  applicationContext.logger.warn('Entity is currently locked', {
    currentLock,
  });

  if (!isCaseLockingEnabled) {
    return;
  }

  if (onLockError instanceof Error) {
    throw onLockError;
  } else if (typeof onLockError === 'function') {
    await onLockError(applicationContext, options, authorizedUser);
  }
  throw new ServiceUnavailableError(
    'One of the items you are trying to update is being updated by someone else',
  );
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
  let isLockAcquired = false;
  let attempts = 0;

  // First check if any are already locked, if so throw an error
  while (!isLockAcquired) {
    try {
      attempts++;
      await Promise.all(
        identifiers.map(entityIdentifier =>
          checkLock({
            applicationContext,
            authorizedUser,
            identifier: entityIdentifier,
            onLockError,
            options,
          }),
        ),
      );
      isLockAcquired = true;
    } catch (err) {
      if (attempts > retries) {
        throw err;
      }
      await applicationContext.getUtilities().sleep(waitTime);
    }
  }

  // Second, lock them up so the are unavailable
  await Promise.all(
    identifiers.map(entityIdentifier =>
      applicationContext.getPersistenceGateway().createLock({
        applicationContext,
        identifier: entityIdentifier,
        ttl,
      }),
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
  return applicationContext.getPersistenceGateway().removeLock({
    applicationContext,
    identifiers,
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
    const { identifiers, ttl } = await getLockInfo(applicationContext, options);

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

    await removeLock({
      applicationContext,
      identifiers,
    });

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
