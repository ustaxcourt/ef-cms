import { ALLOWLIST_FEATURE_FLAGS } from '../../business/entities/EntityConstants';
import { ServiceUnavailableError } from '../../errors/errors';

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
}) => {
  const isCaseLockingEnabled = await applicationContext
    .getUseCases()
    .getFeatureFlagValueInteractor(applicationContext, {
      featureFlag: ALLOWLIST_FEATURE_FLAGS.ENTITY_LOCKING_FEATURE_FLAG.key,
    });

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
  identifier,
  onLockError,
  options = {},
  retries = 0,
  ttl = 30,
  waitTime = 3000,
}: {
  applicationContext: IApplicationContext;
  identifier: string | string[];
  onLockError?: Error | Function;
  options?: any;
  retries?: number;
  ttl?: number;
  waitTime?: number;
}) => {
  if (!identifier) return;
  const identifiersToLock =
    typeof identifier === 'string' ? [identifier] : identifier;

  let isLockAcquired = false;
  let attempts = 0;

  // First check if any are already locked, if so throw an error
  while (!isLockAcquired) {
    try {
      attempts++;
      await Promise.all(
        identifiersToLock.map(entityIdentifier =>
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
    identifiersToLock.map(entityIdentifier =>
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
  identifier,
}: {
  applicationContext: IApplicationContext;
  identifier: string | string[];
}) => {
  if (!identifier) return;
  const identifiersToUnlock =
    typeof identifier === 'string' ? [identifier] : identifier;

  return Promise.all(
    identifiersToUnlock.map(entityIdentifier =>
      applicationContext.getPersistenceGateway().removeLock({
        applicationContext,
        identifier: entityIdentifier,
      }),
    ),
  );
};

/**
 * will wrap a function with logic to acquire a lock and delete a lock after finishing.
 *
 * @param {function} cb the original function to wrap
 * @param {function} getLockInfo a function which is passes the original args for getting the lock suffix
 * @param {error} onLockError the error object to throw if a lock is already in use
 * @returns {object} the item that was retrieved
 */
export function withLocking(
  cb: (applicationContext: IApplicationContext, options: any) => any,
  getLockInfo: Function,
  onLockError?: Error | Function,
) {
  return async function (
    applicationContext: IApplicationContext,
    options: any,
  ) {
    const { identifier, ttl }: { identifier: string; ttl?: number } =
      await getLockInfo(applicationContext, options);

    await acquireLock({
      applicationContext,
      identifier,
      onLockError,
      options,
      ttl,
    });

    let caughtError;
    let results;
    try {
      results = await cb(applicationContext, options);
    } catch (err) {
      caughtError = err;
    }

    await removeLock({
      applicationContext,
      identifier,
    });

    if (caughtError) {
      throw caughtError;
    }
    return results;
  };
}
