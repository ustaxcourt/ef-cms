import { ServerApplicationContext } from '@web-api/applicationContext';

export const confirmSignUpInteractor = async (
  applicationContext: ServerApplicationContext,
  { confirmationCode, userId }: { confirmationCode: string; userId: string },
): Promise<void> => {
  const accountConfirmationRecord = await applicationContext
    .getPersistenceGateway()
    .getAccountConfirmationCode(applicationContext, { userId });
  if (accountConfirmationRecord.confirmationCode !== confirmationCode) {
    throw new Error('confirmation code does not match');
  }

  const cognito = applicationContext.getCognito();

  await cognito.adminConfirmSignUp({
    UserPoolId: process.env.USER_POOL_ID,
    Username: userId,
  });

  await cognito.adminUpdateUserAttributes({
    UserAttributes: [
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ],
    UserPoolId: process.env.USER_POOL_ID,
    Username: userId,
  });
};
