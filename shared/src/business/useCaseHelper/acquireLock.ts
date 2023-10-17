import { ALLOWLIST_FEATURE_FLAGS } from '../../business/entities/EntityConstants';
import { ServiceUnavailableError } from '@web-api/errors/errors';

export const checkLock = async ({
  applicationContext,
  identifier,
  onLockError,
  options = {},
}: {
  applicationContext: IApplicationContext;
  identifier: string;
  onLockError?: Error | Function;
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
    await onLockError(applicationContext, options);
  }
  throw new ServiceUnavailableError(
    'One of the items you are trying to update is being updated by someone else',
  );
};

export const acquireLock = async ({
  applicationContext,
  identifiers = [],
  onLockError,
  options = {},
  retries = 0,
  ttl = 30,
  waitTime = 3000,
}: {
  applicationContext: IApplicationContext;
  identifiers?: string[];
  onLockError?: Error | Function;
  options?: any;
  retries?: number;
  ttl?: number;
  waitTime?: number;
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
  applicationContext: IApplicationContext;
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
    applicationContext: IApplicationContext,
    options: InteractorInput,
  ) => Promise<InteractorOutput>,
  getLockInfo: (
    applicationContext: IApplicationContext,
    options: any,
  ) =>
    | Promise<{ identifiers: string[]; ttl?: number }>
    | { identifiers: string[]; ttl?: number },
  onLockError?: Error | Function,
): (
  applicationContext: IApplicationContext,
  options: InteractorInput,
) => Promise<InteractorOutput> {
  return async function (
    applicationContext: IApplicationContext,
    options: InteractorInput,
  ) {
    const { identifiers, ttl } = await getLockInfo(applicationContext, options);

    await acquireLock({
      applicationContext,
      identifiers,
      onLockError,
      options,
      ttl,
    });

    let caughtError;
    let results: InteractorOutput;
    try {
      results = await interactor(applicationContext, options);
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
