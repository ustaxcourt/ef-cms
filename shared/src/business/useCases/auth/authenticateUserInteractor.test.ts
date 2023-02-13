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
});
