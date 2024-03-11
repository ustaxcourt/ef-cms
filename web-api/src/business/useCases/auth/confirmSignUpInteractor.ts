import { InvalidRequest, NotFoundError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const confirmSignUpInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    confirmationCode,
    email,
    userId,
  }: { confirmationCode: string; userId: string; email: string },
): Promise<void> => {
  const accountConfirmationCode = await applicationContext
    .getPersistenceGateway()
    .getAccountConfirmationCode(applicationContext, { userId });

  if (accountConfirmationCode !== confirmationCode) {
    applicationContext.logger.info('User did not confirm account within 24hr', {
      email,
    });
    throw new InvalidRequest('Confirmation code expired');
  }

  await applicationContext.getCognito().adminConfirmSignUp({
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
  });

  const updatePetitionerAttributes = applicationContext
    .getUserGateway()
    .updateUser(applicationContext, {
      attributesToUpdate: {
        email,
      },
      email,
    });

  await Promise.all([
    updatePetitionerAttributes,
    createPetitionerUser(applicationContext, { email, userId }),
  ]);
};

const createPetitionerUser = async (
  applicationContext: ServerApplicationContext,
  { email, userId }: { email: string; userId: string },
) => {
  const user = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, { email });

  if (!user) {
    throw new NotFoundError(`User not found with email: ${email}`);
  }

  await applicationContext
    .getUseCases()
    .createPetitionerAccountInteractor(applicationContext, {
      email,
      name: user.name,
      userId,
    });
};
