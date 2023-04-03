import { ServiceUnavailableError } from '../../../errors/errors';

export const getCaseByDocketNumber = async ({
  acquireLock = false,
  applicationContext,
  docketNumber,
}) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (acquireLock && caseRecord.lock) {
    throw new ServiceUnavailableError(`${docketNumber} is currently locked`);
  } else if (acquireLock) {
    await applicationContext.getUseCaseHelpers().acquireLock({
      applicationContext,
      lockName: docketNumber,
    });
  }
  return caseRecord;
};
