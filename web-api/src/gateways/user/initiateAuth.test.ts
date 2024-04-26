import {
  ChallengeNameType,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { initiateAuth } from '@web-api/gateways/user/initiateAuth';

describe('initiateAuth', () => {
  it('should throw an error when initiateAuth returns a new password required challenge', async () => {
    const mockOutput: InitiateAuthCommandOutput = {
      $metadata: {},
      ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
    };
    applicationContext
      .getCognito()
      .initiateAuth.mockResolvedValueOnce(mockOutput);

    await expect(
      initiateAuth(applicationContext, {
        email: 'test@example.com',
        password: 'P@ssw0rd',
      }),
    ).rejects.toThrow('NewPasswordRequired');
  });

  it('should throw an error when initiateAuth does not return any tokens', async () => {
    const mockOutput: InitiateAuthCommandOutput = {
      $metadata: {},
    };
    applicationContext.getCognito().initiateAuth.mockResolvedValue(mockOutput);

    await expect(
      initiateAuth(applicationContext, {
        email: 'test@example.com',
        password: 'P@ssw0rd',
      }),
    ).rejects.toThrow('InitiateAuthError');
  });

  it('should return the user`s tokens when they are successfully authenticated', async () => {
    const mockAccessToken = 'c39d1dea-ca08-47ba-9935-0bfc354b68dc';
    const mockRefreshToken = 'e4216a49-aa21-4e37-93d6-23374c0ac126';
    const mockIdToken = '7120b318-153d-454e-8c24-c710ea4ff4ab';
    const mockOutput: InitiateAuthCommandOutput = {
      $metadata: {},
      AuthenticationResult: {
        AccessToken: mockAccessToken,
        IdToken: mockIdToken,
        RefreshToken: mockRefreshToken,
      },
    };
    applicationContext.getCognito().initiateAuth.mockResolvedValue(mockOutput);

    const result = await initiateAuth(applicationContext, {
      email: 'test@example.com',
      password: 'P@ssw0rd',
    });

    expect(result).toEqual({
      accessToken: mockAccessToken,
      idToken: mockIdToken,
      refreshToken: mockRefreshToken,
    });
  });
});
