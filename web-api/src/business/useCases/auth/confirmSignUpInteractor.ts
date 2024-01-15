import { InvalidRequest } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const confirmSignUpInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    confirmationCode,
    email,
    userId,
  }: { confirmationCode: string; userId: string; email: string },
): Promise<void> => {
  const accountConfirmationRecord = await applicationContext
    .getPersistenceGateway()
    .getAccountConfirmationCode(applicationContext, { userId });

  if (accountConfirmationRecord.confirmationCode !== confirmationCode) {
    applicationContext.logger.info(
      'action: user_did_not_confirm_account_within_24hr',
    );
    throw new InvalidRequest('Confirmation code expired');
  }

  const cognito = applicationContext.getCognito();

  await cognito.adminConfirmSignUp({
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
  });

  const updatePetitionerAttributes = cognito.adminUpdateUserAttributes({
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
  const cognito = applicationContext.getCognito();
  const users = await cognito.listUsers({
    AttributesToGet: ['name'],
    Filter: `email = "${email}"`,
    UserPoolId: process.env.USER_POOL_ID,
  });

  const name = users.Users?.[0].Attributes?.find(
    element => element.Name === 'name',
  )?.Value!;

  await applicationContext
    .getUseCases()
    .createPetitionerAccountInteractor(applicationContext, {
      email,
      name,
      userId,
    });
};
