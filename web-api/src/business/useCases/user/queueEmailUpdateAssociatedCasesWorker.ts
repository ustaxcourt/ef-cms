import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { RawPractitioner } from '../../../../../shared/src/business/entities/Practitioner';
import { RawUser } from '../../../../../shared/src/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const queueEmailUpdateAssociatedCasesWorker = async (
  applicationContext: ServerApplicationContext,
  { user }: { user: RawUser | RawPractitioner },
  authorizedUser: AuthUser,
): Promise<void> => {
  await applicationContext
    .getUseCases()
    .queueUpdateAssociatedCasesWorker(
      applicationContext,
      { user },
      authorizedUser,
    );

  try {
    const expectedUpdatedCaseCount = (
      await applicationContext.getPersistenceGateway().getDocketNumbersByUser({
        applicationContext,
        userId: user.userId,
      })
    ).length;

    let checkCount = true;
    while (checkCount) {
      await applicationContext.getUtilities().sleep(1500);
      const actualUpdatedCaseCount = await applicationContext
        .getPersistenceGateway()
        .getCasesByEmailTotal({
          applicationContext,
          email: user.email!,
        });

      if (actualUpdatedCaseCount >= expectedUpdatedCaseCount)
        checkCount = false;
    }

    user.isUpdatingInformation = false;
    await applicationContext.getPersistenceGateway().updateUser({
      applicationContext,
      user,
    });
  } catch (e) {
    user.isUpdatingInformation = false;
    await applicationContext.getPersistenceGateway().updateUser({
      applicationContext,
      user,
    });
  }
};
