import { ServerApplicationContext } from '@web-api/applicationContext';

export const confirmSignUpInteractor = async (
  applicationContext: ServerApplicationContext,
  { confirmationCode, userId }: { confirmationCode: string; userId: string },
) => {
  const accountConfirmationRecord = await applicationContext
    .getPersistenceGateway()
    .getAccountConfirmationCode(applicationContext, { userId });
  if (accountConfirmationRecord.confirmationCode !== confirmationCode) {
    throw new Error('confirmation code does not match');
  }

  const cognito = applicationContext.getCognito();
  const foundUsers = await cognito.listUsers({
    AttributesToGet: ['sub', 'username'],
    Filter: `sub = "${userId}"`,
    UserPoolId: process.env.USER_POOL_ID,
  });
  const userName = foundUsers?.Users?.[0]?.Username;
  if (!userName) {
    throw new Error(`No user found in cognito with given ID: ${userId}`);
  }

  await cognito.adminConfirmSignUp({
    Username: userName,
    UserPoolId: process.env.USER_POOL_ID,
  });
};
