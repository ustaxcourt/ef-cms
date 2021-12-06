const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { authenticateUserInteractor } = require('./authenticateUserInteractor');

describe('authenticateUserInteractor', () => {
  beforeEach(() => {
    applicationContext.getPersistenceGateway().confirmAuthCode.mockReturnValue({
      refreshToken: 'abc',
      token: '123',
    });
  });

  it('attempts to hit cognito and get an id token and refresh token', async () => {
    const expectedCode = 'codecode';
    const result = await authenticateUserInteractor(applicationContext, {
      code: expectedCode,
    });
    expect(
      applicationContext.getPersistenceGateway().confirmAuthCode.mock
        .calls[0][1],
    ).toEqual({ code: expectedCode });
    expect(result).toEqual({
      refreshToken: 'abc',
      token: '123',
    });
  });
});
