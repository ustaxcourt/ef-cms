import { ServiceUnavailableError } from '../../errors/errors';

export const acquireLock = async ({
  applicationContext,
  lockName,
}: {
  applicationContext: IApplicationContext;
  lockName: string;
}) => {
  const currentLock = await applicationContext
    .getPersistenceGateway()
    .getLock({ applicationContext, lockName });

  if (currentLock) {
    throw new ServiceUnavailableError(`${lockName} is currently locked`);
  }

  const lockId = await applicationContext.getUniqueId();
  await applicationContext.getPersistenceGateway().acquireLock({
    applicationContext,
    lockId,
    lockName,
    user: applicationContext.getCurrentUser(),
  });
  return lockId;
};
