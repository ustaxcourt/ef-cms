import { getCognito } from '@web-api/persistence/cognito/getCognito';

export const cognitoPreSignupLambdaHandler = async event => {
  const { userPoolId, request } = event;

  try {
    const user = await getCognito().adminGetUser({
      UserPoolId: userPoolId,
      Username: request.userAttributes.email.toLowerCase(),
    });

    await getCognito().adminLinkProviderForUser({
      UserPoolId: userPoolId,
      SourceUser: {
        ProviderName: process.env.IDP_NAME,
        ProviderAttributeName: 'email',
        ProviderAttributeValue: request.userAttributes.email,
      },
      DestinationUser: {
        ProviderName: 'Cognito',
        ProviderAttributeValue: user.Username,
      },
    });
  } catch (error: any) {
    if (error.name !== 'UserNotFoundException') {
      throw error;
    }
  }

  return event;
};
