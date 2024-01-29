import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { updatePetitionerCases } from '../../../../../shared/src/business/useCases/users/verifyUserPendingEmailInteractor';

export const updatePetitionerCaseInteractor = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, user }: { docketNumber: string; user: RawUser },
): Promise<void> => {
  await applicationContext.getUseCaseHelpers().acquireLock({
    applicationContext,
    identifiers: [`case|${docketNumber}`],
    retries: 10,
    ttl: 900,
    waitTime: 5000,
  });

  await updatePetitionerCases({
    applicationContext,
    docketNumbersAssociatedWithUser: [docketNumber],
    user,
  });

  await applicationContext.getPersistenceGateway().removeLock({
    applicationContext,
    identifiers: [`case|${docketNumber}`],
  });
};
