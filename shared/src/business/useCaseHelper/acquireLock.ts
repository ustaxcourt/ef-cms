export const acquireLock = async ({
  applicationContext,
  identifier,
  onLockError,
  prefix,
}: {
  applicationContext: IApplicationContext;
  identifier: string;
  prefix: string;
  onLockError: Error;
}) => {
  const currentLock = await applicationContext
    .getPersistenceGateway()
    .getLock({ applicationContext, identifier, prefix });

  if (currentLock) {
    throw onLockError;
  }

  const lockId = await applicationContext.getUniqueId();
  await applicationContext.getPersistenceGateway().createLock({
    applicationContext,
    identifier,
    prefix,
  });
  return lockId;
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
    const { identifier, prefix } = getLockInfo(options);

    await acquireLock({
      applicationContext,
      identifier,
      onLockError,
      prefix,
    });

    const results = await cb(applicationContext, options);

    await applicationContext
      .getPersistenceGateway()
      .removeLock({ applicationContext, identifier, prefix });

    return results;
  };
}
