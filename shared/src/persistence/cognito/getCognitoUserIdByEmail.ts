import { AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';

exports.getCognitoUserIdByEmail = async ({ applicationContext, email }) => {
  try {
    const userFromCognito = await applicationContext.getCognito().send(
      new AdminGetUserCommand({
        UserPoolId: process.env.USER_POOL_ID,
        Username: email,
      }),
    );

    const customUserId = (
      userFromCognito.UserAttributes.find(
        attribute => attribute.Name === 'custom:userId',
      ) || {}
    ).Value;
    return customUserId || userFromCognito.Username;
  } catch (e) {
    return null;
  }
};
