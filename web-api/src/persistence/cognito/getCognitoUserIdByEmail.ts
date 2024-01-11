import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

export const getCognitoUserIdByEmail = async ({
  applicationContext,
  email,
}) => {
  try {
    const cognito: CognitoIdentityProvider = applicationContext.getCognito();
    const userFromCognito = await cognito.adminGetUser({
      UserPoolId: process.env.USER_POOL_ID,
      Username: email,
    });

    const customUserId = (
      userFromCognito.UserAttributes?.find(
        attribute => attribute.Name === 'custom:userId',
      ) || {}
    ).Value;
    // replace with sub here
    return customUserId || userFromCognito.Username;
  } catch (e) {
    return null;
  }
};
