import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

const getClientId = async ({
  cognito,
  userPoolId,
}: {
  cognito: CognitoIdentityProvider;
  userPoolId: string;
}) => {
  const results = await cognito.listUserPoolClients({
    MaxResults: 60,
    UserPoolId: userPoolId,
  });
  const clientId = results.UserPoolClients[0].ClientId;
  return clientId;
};

const getUserPoolId = async ({
  cognito,
  env,
}: {
  cognito: CognitoIdentityProvider;
  env: string;
}) => {
  const results = await cognito.listUserPools({
    MaxResults: 50,
  });
  const userPoolId = results.UserPools.find(
    pool => pool.Name === `efcms-${env}`,
  ).Id;
  return userPoolId;
};

const enableUser = async ({
  cognito,
  env,
  username,
}: {
  cognito: CognitoIdentityProvider;
  env: string;
  username: string;
}) => {
  const userPoolId = await getUserPoolId({ cognito, env });
  await cognito.adminEnableUser({
    UserPoolId: userPoolId,
    Username: username,
  });
};

export const getUserToken = async ({
  cognito,
  env,
  password,
  username,
}: {
  cognito: CognitoIdentityProvider;
  env: string;
  password: string;
  username: string;
}) => {
  const userPoolId = await getUserPoolId({ cognito, env });

  if (!userPoolId) throw new Error('expected a user pool id to be returned');
  const clientId = await getClientId({ cognito, userPoolId });

  await enableUser({ cognito, env, username });
  const response = await cognito.adminInitiateAuth({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      PASSWORD: password,
      USERNAME: username,
    },
    ClientId: clientId,
    UserPoolId: userPoolId,
  });

  return response.AuthenticationResult.IdToken;
};
