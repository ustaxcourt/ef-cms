import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

export const getClientId = async ({ userPoolId }) => {
  const cognitoIdentityProvider = new CognitoIdentityProvider({
    region: 'us-east-1',
  });

  const { UserPoolClients } = await cognitoIdentityProvider.listUserPoolClients(
    {
      MaxResults: 1,
      UserPoolId: userPoolId,
    },
  );

  return UserPoolClients?.[0].ClientId;
};
