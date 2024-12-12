import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  Practitioner,
  RawPractitioner,
} from '@shared/business/entities/Practitioner';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { RawUser, User } from '@shared/business/entities/User';
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
  const docketNumbersByUser = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByUser({
      applicationContext,
      userId: user.userId,
    });

  if (!docketNumbersByUser.length) {
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

  await waitUntilAllExpectedCasesAreUpdatedWithEmail({
    applicationContext,
    userEmail: user.email!,
  })
    .catch(error =>
      console.error(`ERROR CHECKING COUNT OF UPDATED CASES -> ${error}`),
    )
    .finally(async () => {
      await disableIsUserUpdatingFlag({ applicationContext, user });
    });
};

const WAIT_TIMEOUT = 2000;
const MAX_WAITTIME_IN_MINUTES = 14;
const MAX_ITERATIONS = Math.floor(
  (MAX_WAITTIME_IN_MINUTES * 60 * 1000) / WAIT_TIMEOUT,
);

async function waitUntilAllExpectedCasesAreUpdatedWithEmail({
  applicationContext,
  iteration = 0,
  userEmail,
}: {
  applicationContext: ServerApplicationContext;
  iteration?: number;
  userEmail: string;
}): Promise<void> {
  await applicationContext.getUtilities().sleep(WAIT_TIMEOUT);

  const docketNumbersByUser = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByUser({
      applicationContext,
      userId: userEmail,
    });
  const expectedCount = docketNumbersByUser.length;

  const actualCount = await applicationContext
    .getPersistenceGateway()
    .getCasesByEmailTotal({
      applicationContext,
      email: userEmail,
    });

  if (actualCount >= expectedCount) return;
  if (iteration >= MAX_ITERATIONS) return;
  return waitUntilAllExpectedCasesAreUpdatedWithEmail({
    applicationContext,
    iteration: iteration + 1,
    userEmail,
  });
}
