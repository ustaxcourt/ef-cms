import { ROLES } from '@shared/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  updatePetitionerCases,
  updatePractitionerCases,
} from '../../../../../shared/src/business/useCases/users/verifyUserPendingEmailInteractor';

export const updateAssociatedCaseWorker = async (
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

  if (user.role === ROLES.petitioner) {
    await updatePetitionerCases({
      applicationContext,
      docketNumbersAssociatedWithUser: [docketNumber],
      user,
    });
  }
  if (
    user.role === ROLES.privatePractitioner ||
    user.role === ROLES.irsPractitioner ||
    user.role === ROLES.inactivePractitioner
  ) {
    await updatePractitionerCases({
      applicationContext,
      docketNumbersAssociatedWithUser: [docketNumber],
      user,
    });
  }

  await applicationContext.getPersistenceGateway().removeLock({
    applicationContext,
    identifiers: [`case|${docketNumber}`],
  });
};
