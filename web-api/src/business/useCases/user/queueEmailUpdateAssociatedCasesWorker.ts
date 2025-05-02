import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UserFactory } from '@shared/business/entities/factories/UserFactory';

async function disableIsUserUpdatingFlag({
  applicationContext,
  user,
}: {
  applicationContext: ServerApplicationContext;
  user: RawUser | RawPractitioner;
}): Promise<void> {
  const userFactory = new UserFactory(user);
  const UserClass = userFactory.getClass();

  user.isUpdatingInformation = false;
  const userEntity = new UserClass(user);

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
    userRole: user.role,
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
export const MAX_ITERATIONS = Math.floor(
  (MAX_WAITTIME_IN_MINUTES * 60 * 1000) / WAIT_TIMEOUT,
);

async function waitUntilAllExpectedCasesAreUpdatedWithEmail({
  applicationContext,
  iteration = 0,
  userEmail,
  userRole,
}: {
  applicationContext: ServerApplicationContext;
  iteration?: number;
  userEmail: string;
  userRole: string;
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
    userRole,
  });
}
