const getClientId = async ({ cognito, userPoolId }) => {
  const results = await cognito
    .listUserPoolClients({
      MaxResults: 60,
      UserPoolId: userPoolId,
    })
    .promise();
  const clientId = results.UserPoolClients[0].ClientId;
  return clientId;
};

const getUserPoolId = async ({ cognito, env }) => {
  const results = await cognito
    .listUserPools({
      MaxResults: 50,
    })
    .promise();
  const userPoolId = results.UserPools.find(
    pool => pool.Name === `efcms-${env}`,
  ).Id;
  return userPoolId;
};

const enableUser = async ({ cognito, env, username }) => {
  const userPoolId = await getUserPoolId({ cognito, env });
  await cognito
    .adminEnableUser({
      UserPoolId: userPoolId,
      Username: username,
    })
    .promise();
};

export const getUserToken = async ({ cognito, env, password, username }) => {
  const userPoolId = await getUserPoolId({ cognito, env });
  const clientId = await getClientId({ cognito, userPoolId });

  await enableUser({ cognito, env, username });
  const response = await cognito
    .adminInitiateAuth({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        PASSWORD: password,
        USERNAME: username,
      },
      ClientId: clientId,
      UserPoolId: userPoolId,
    })
    .promise();

  return response.AuthenticationResult.IdToken;
};
