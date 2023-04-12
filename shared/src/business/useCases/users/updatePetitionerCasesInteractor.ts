import { ServiceUnavailableError } from '../../../errors/errors';
import { updatePetitionerCases } from './verifyUserPendingEmailInteractor';

export const updatePetitionerCasesInteractor = async ({
  applicationContext,
  user,
}) => {
  const docketNumbers = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByUser({
      applicationContext,
      userId: user.userId,
    });

  await applicationContext.getUseCaseHelpers().acquireLock({
    applicationContext,
    identifier: docketNumbers,
    onLockError: new ServiceUnavailableError(
      'One of the docket numbers is being updated',
    ),
    prefix: 'case',
    retries: 10,
    ttl: 900,
    waitTime: 5000,
  });

  await updatePetitionerCases({
    applicationContext,
    docketNumbersAssociatedWithUser: docketNumbers,
    user,
  });

  await applicationContext.getPersistenceGateway().removeLock({
    applicationContext,
    identifier: docketNumbers,
    prefix: 'case',
  });
};
