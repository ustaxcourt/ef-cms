import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getDocketNumbersByUser } from '@web-api/persistence/postgres/users/cases/getCasesForUser';

export const queueUpdateAssociatedCasesWorker = async (
  applicationContext: ServerApplicationContext,
  { user }: { user: RawUser | RawPractitioner },
  authorizedUser: AuthUser,
): Promise<void> => {
  const docketNumbersAssociatedWithUser = await getDocketNumbersByUser({
    userId: user.userId,
  });

  await Promise.all(
    docketNumbersAssociatedWithUser.map(docketNumber =>
      applicationContext.getWorkerGateway().queueWork(applicationContext, {
        message: {
          authorizedUser,
          payload: { docketNumber, user },
          type: MESSAGE_TYPES.UPDATE_ASSOCIATED_CASE,
        },
      }),
    ),
  );
};
