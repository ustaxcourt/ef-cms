import { updatePetitionerCases } from './verifyUserPendingEmailInteractor';

export const updatePetitionerCasesInteractor = async (
  applicationContext,
  { user },
) => {
  const docketNumbers = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByUser({
      applicationContext,
      userId: user.userId,
    });

  await applicationContext.getUseCaseHelpers().acquireLock({
    applicationContext,
    identifiers: docketNumbers.map(item => `case|${item}`),
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
    identifiers: docketNumbers.map(item => `case|${item}`),
  });
};
