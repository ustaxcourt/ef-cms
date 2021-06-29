const { applicationContext } = require('../test/createTestApplicationContext');
const { refreshTokenInteractor } = require('./refreshTokenInteractor');

describe('refreshToken', () => {
  it('returns a token', async () => {
    applicationContext.getCognitoClientId.mockReturnValue('asdf');
    applicationContext.getCognitoTokenUrl.mockReturnValue(
      'http://example.com/oauth2/token',
    );

    applicationContext.getHttpClient().post.mockResolvedValue({
      data: {
        id_token: '123',
        refresh_token: 'abc',
      },
    });

    let result = await refreshTokenInteractor(applicationContext, {
      refreshToken: 'asdf',
    });

    expect(result).toEqual({ token: '123' });
  });
});
