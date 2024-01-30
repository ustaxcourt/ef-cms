import { InitiateAuthCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { renewIdToken } from '@web-api/persistence/cognito/renewIdToken';

describe('renewIdToken', () => {
  it('should use the provided refresh token to request and return a new id token', async () => {
    const mockIdToken = 'some_id_token';
    const mocka: InitiateAuthCommandOutput = {
      $metadata: {},
      AuthenticationResult: {
        IdToken: mockIdToken,
      },
    };
    applicationContext.getCognito().initiateAuth.mockResolvedValue(mocka);

    const result = await renewIdToken(applicationContext, {
      refreshToken: 'some_token',
    });

    expect(result.idToken).toEqual(mockIdToken);
  });
});
