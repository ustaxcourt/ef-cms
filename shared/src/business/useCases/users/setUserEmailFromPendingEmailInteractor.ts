import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import { ROLES } from '../../entities/EntityConstants';
import { RawPractitioner } from '../../entities/Practitioner';
import { RawUser } from '../../entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { acquireLock } from '@shared/business/useCaseHelper/acquireLock';
import { updatePractitionerCases } from './verifyUserPendingEmailInteractor';

export const setUserEmailFromPendingEmailInteractor = async (
  applicationContext: ServerApplicationContext,
  { user }: { user: RawUser | RawPractitioner },
): Promise<void> => {
  const docketNumbersAssociatedWithUser = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByUser({
      applicationContext,
      userId: user.userId,
    });

  try {
    if (user.role === ROLES.petitioner) {
      await Promise.all(
        docketNumbersAssociatedWithUser.map(docketNumber =>
          applicationContext.getWorkerGateway().initialize(applicationContext, {
            message: {
              payload: { docketNumber, user },
              type: MESSAGE_TYPES.UPDATE_PETITIONER_CASE,
            },
          }),
        ),
      );
    } else {
      await acquireLock({
        applicationContext,
        identifiers: docketNumbersAssociatedWithUser.map(
          item => `case|${item}`,
        ),
        retries: 5,
        waitTime: 3000,
      });
      await updatePractitionerCases({
        applicationContext,
        docketNumbersAssociatedWithUser,
        user,
      });
      await Promise.all(
        docketNumbersAssociatedWithUser.map(docketNumber =>
          applicationContext.getPersistenceGateway().removeLock({
            applicationContext,
            identifiers: [`case|${docketNumber}`],
          }),
        ),
      );
    }
  } catch (error) {
    applicationContext.logger.error(
      'setUserEmailFromPendingEmailInteractor error',
      { error },
    );
    throw error;
  }

  return;
};
