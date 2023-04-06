export const acquireLock = async ({
  applicationContext,
  identifier,
  onLockError,
  prefix,
  ttl = 30,
}: {
  applicationContext: IApplicationContext;
  identifier: string | string[];
  prefix: string;
  onLockError: Error;
  ttl?: number;
}) => {
  if (typeof identifier === 'object') {
    return Promise.all(
      identifier.map(entityIdentifier =>
        acquireLock({
          applicationContext,
          identifier: entityIdentifier,
          onLockError,
          prefix,
          ttl,
        }),
      ),
    );
  }

  const currentLock = await applicationContext
    .getPersistenceGateway()
    .getLock({ applicationContext, identifier, prefix });

  if (currentLock) {
    applicationContext.logger.warn('Entity is currently locked', {
      currentLock,
    });
    throw onLockError;
  }

  await applicationContext.getPersistenceGateway().createLock({
    applicationContext,
    identifier,
    prefix,
    ttl,
  });
};

export const removeLock = ({
  applicationContext,
  identifier,
  prefix,
}: {
  applicationContext: IApplicationContext;
  identifier: string | string[];
  prefix: string;
}) => {
  if (typeof identifier === 'object') {
    return Promise.all(
      identifier.map(entityIdentifier =>
        removeLock({
          applicationContext,
          identifier: entityIdentifier,
          prefix,
        }),
      ),
    );
  }

  return applicationContext
    .getPersistenceGateway()
    .removeLock({ applicationContext, identifier, prefix });
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
  getLockInfo,
  onLockError,
) {
  return async function (
    applicationContext: IApplicationContext,
    options: any,
  ) {
    const { identifier, prefix, ttl } = getLockInfo(options);

    await acquireLock({
      applicationContext,
      identifier,
      onLockError,
      prefix,
      ttl,
    });

    const results = await cb(applicationContext, options);

    await removeLock({
      applicationContext,
      identifier,
      prefix,
    });

    return results;
  };
}
