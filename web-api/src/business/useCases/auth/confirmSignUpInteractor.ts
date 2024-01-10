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
    throw new InvalidRequest('Confirmation code expired');
  }

  const cognito = applicationContext.getCognito();

  await cognito.adminConfirmSignUp({
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
  });

  await cognito.adminUpdateUserAttributes({
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
};
