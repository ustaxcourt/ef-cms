import { cognitoInboundFederationLambdaHandler } from '@web-api/lambdas/cognitoInboundFederation/cognitoInboundFederationLambda';

describe('cognitoInboundFederationLambda', () => {
  it('should make user email lowercase in event response', () => {
    const result = cognitoInboundFederationLambdaHandler({
      userPoolId: 'userPoolId',
      request: {
        attributes: {
          userInfo: {
            email: 'New.User@example.com',
            name: 'New User',
            userId: 12345,
          },
          idToken: {
            tokenId: '4567',
          },
        },
      },
    });

    expect(result.response).toEqual({
      userAttributesToMap: {
        email: 'new.user@example.com',
        name: 'New User',
        userId: 12345,
        tokenId: '4567',
      },
    });
  });

  it('should not try to update email that is not a string', () => {
    const result = cognitoInboundFederationLambdaHandler({
      userPoolId: 'userPoolId',
      request: {
        attributes: {
          userInfo: {
            email: 12345,
          },
        },
      },
    });

    expect(result.response).toEqual({
      userAttributesToMap: {
        email: 12345,
      },
    });
  });
});
