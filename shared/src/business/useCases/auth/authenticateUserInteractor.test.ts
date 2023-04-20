import { applicationContext } from '../../test/createTestApplicationContext';
import { authenticateUserInteractor } from './authenticateUserInteractor';

describe('authenticateUserInteractor', () => {
  const refreshTokenAndToken = {
    refreshToken: 'abc',
    token: '123',
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .confirmAuthCode.mockReturnValue(refreshTokenAndToken);
  });

  it('attempts to hit cognito and get an id token and refresh token', async () => {
    const expectedCode = 'codecode';
    const result = await authenticateUserInteractor(applicationContext, {
      code: expectedCode,
    });
    expect(
      applicationContext.getPersistenceGateway().confirmAuthCode.mock
        .calls[0][0],
    ).toEqual({ applicationContext, code: expectedCode });
    expect(result).toEqual(refreshTokenAndToken);
  });

  describe('cognitoLocal', () => {
    const loginInfo = {
      code: 'userName',
      cognitoLocal: 'password',
    };
    const initiateAuthResult = { AuthenticationResult: { IdToken: '3' } };
    beforeAll(() => {
      applicationContext.getCognito().initiateAuth.mockReturnValue({
        promise: () => initiateAuthResult,
      });
    });

    it('attempts to hit cognitoLocal initiateAuth when cognitoLocal is passed', async () => {
      const result = await authenticateUserInteractor(
        applicationContext,
        loginInfo,
      );
      expect(applicationContext.getCognito().initiateAuth).toHaveBeenCalled();
      expect(result).toMatchObject({
        refreshToken: '3',
        token: '3',
      });
    });

    it('returns an alert with authentication challenge information when password must be reset', async () => {
      applicationContext.getCognito().initiateAuth.mockReturnValueOnce({
        promise: () => {
          return {
            ChallengeName: 'NEW_PASSWORD_REQUIRED',
            Session: 'abc123',
          };
        },
      });

      const result = await authenticateUserInteractor(
        applicationContext,
        loginInfo,
      );
      expect(applicationContext.getCognito().initiateAuth).toHaveBeenCalled();
      expect(result).toMatchObject({
        alertError: 'NEW_PASSWORD_REQUIRED',
        sessionId: 'abc123',
      });
    });
  });
});
