const { applicationContext } = require('../test/createTestApplicationContext');
const { authorizeCodeInteractor } = require('./authorizeCodeInteractor');

describe('authorizeCodeInteractor', () => {
  it('returns the expected token and refresh token', async () => {
    applicationContext.getCognitoClientId.mockReturnValue('abc');
    applicationContext.getCognitoRedirectUrl.mockReturnValue(
      'http://example.com',
    );
    applicationContext.getCognitoTokenUrl.mockReturnValue(
      'http://example.com/oauth2/token',
    );
    applicationContext.getHttpClient().post.mockResolvedValue({
      data: {
        id_token: '123',
        refresh_token: 'abc',
      },
    });

    const response = await authorizeCodeInteractor(applicationContext, {});

    expect(response).toEqual({
      refreshToken: 'abc',
      token: '123',
    });
    expect(applicationContext.getHttpClient().post.mock.calls[0][0]).toEqual(
      'http://example.com/oauth2/token',
    );
    expect(applicationContext.getHttpClient().post.mock.calls[0][1]).toEqual(
      'client_id=abc&grant_type=authorization_code&redirect_uri=http%3A%2F%2Fexample.com',
    );
  });
});
