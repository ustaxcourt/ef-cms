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
    applicationContext.logger.info(
      'action: user_did_not_confirm_account_within_24hr',
    );
    throw new InvalidRequest('Confirmation code expired');
  }

  await applicationContext.getCognito().adminConfirmSignUp({
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
  });

  const updatePetitionerAttributes = applicationContext
    .getCognito()
    .adminUpdateUserAttributes({
      UserAttributes: [
        {
          Name: 'email_verified',
          Value: 'true',
        },
        {
          Name: 'email',
          Value: email,
        },
      ],
      UserPoolId: process.env.USER_POOL_ID,
      Username: email,
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
