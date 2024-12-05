import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  Practitioner,
  RawPractitioner,
} from '../../../../../shared/src/business/entities/Practitioner';
import { ROLES } from '@shared/business/entities/EntityConstants';
import {
  RawUser,
  User,
} from '../../../../../shared/src/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';

async function disableIsUserUpdatingFlag({
  applicationContext,
  user,
}: {
  applicationContext: ServerApplicationContext;
  user: RawUser | RawPractitioner;
}): Promise<void> {
  user.isUpdatingInformation = false;
  let userEntity;
  if (
    user.role === ROLES.privatePractitioner ||
    user.role === ROLES.irsPractitioner ||
    user.role === ROLES.inactivePractitioner
  ) {
    userEntity = new Practitioner(user);
  } else {
    userEntity = new User(user);
  }

  await applicationContext.getPersistenceGateway().updateUser({
    applicationContext,
    user: userEntity.validate().toRawObject(),
  });
}

export const queueEmailUpdateAssociatedCasesWorker = async (
  applicationContext: ServerApplicationContext,
  { user }: { user: RawUser | RawPractitioner },
  authorizedUser: AuthUser,
): Promise<void> => {
  const docketNumbersAssociatedWithUser = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByUser({
      applicationContext,
      userId: user.userId,
    });

  if (!docketNumbersAssociatedWithUser.length) {
    await disableIsUserUpdatingFlag({ applicationContext, user });
    return;
  }

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

    await disableIsUserUpdatingFlag({ applicationContext, user });
  } catch (e) {
    await disableIsUserUpdatingFlag({ applicationContext, user });
  }
};
