import { InitiateAuthCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { renewIdToken } from '@web-api/gateways/user/renewIdToken';

describe('renewIdToken', () => {
  it('should throw an error when initiateAuth does not return an IdToken', async () => {
    const mockOutput: InitiateAuthCommandOutput = {
      $metadata: {},
    };
    applicationContext.getCognito().initiateAuth.mockResolvedValue(mockOutput);

    await expect(
      renewIdToken(applicationContext, {
        refreshToken: 'some_token',
      }),
    ).rejects.toThrow('Id token not present on initiateAuth response');
  });

  it('should use the provided refresh token to request and return a new id token', async () => {
    const mockIdToken = 'some_id_token';
    const mockOutput: InitiateAuthCommandOutput = {
      $metadata: {},
      AuthenticationResult: {
        IdToken: mockIdToken,
      },
    };
    applicationContext.getCognito().initiateAuth.mockResolvedValue(mockOutput);

    const result = await renewIdToken(applicationContext, {
      refreshToken: 'some_token',
    });

    expect(result).toEqual(mockIdToken);
  });
});
