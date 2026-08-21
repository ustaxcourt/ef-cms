import { getCognito } from '@web-api/persistence/cognito/getCognito';

export const cognitoPreSignupLambdaHandler = async event => {
  console.log('presign up event: ', event);

  const { userPoolId, request } = event;

  const user = await getCognito().adminGetUser({
    UserPoolId: userPoolId,
    Username: request.userAttributes.email,
  });

  if (user) {
    await getCognito().adminLinkProviderForUser({
      UserPoolId: userPoolId,
      SourceUser: {
        ProviderName: 'cognitoFakeUserPool',
        ProviderAttributeName: 'email',
        ProviderAttributeValue: request.userAttributes.email,
      },
      DestinationUser: {
        ProviderName: 'Cognito',
        ProviderAttributeValue: user.Username,
      },
    });
  }

  return event;
};
