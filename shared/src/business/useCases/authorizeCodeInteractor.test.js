const sinon = require('sinon');
const { authorizeCodeInteractor } = require('./authorizeCodeInteractor');

describe('authorizeCodeInteractor', () => {
  let applicationContext;

  it('returns the expected token and refresh token', async () => {
    const postStub = sinon.stub().resolves({
      data: {
        id_token: '123',
        refresh_token: 'abc',
      },
    });
    applicationContext = {
      getCognitoClientId: () => 'abc',
      getCognitoRedirectUrl: () => 'http://example.com',
      getCognitoTokenUrl: () => 'http://example.com/oauth2/token',
      getCurrentUser: () => {
        return {};
      },
      getHttpClient: () => ({
        post: postStub,
      }),
    };
    const response = await authorizeCodeInteractor({ applicationContext });
    expect(response).toEqual({
      refreshToken: 'abc',
      token: '123',
    });
    expect(postStub.getCall(0).args[0]).toEqual(
      'http://example.com/oauth2/token',
    );
    expect(postStub.getCall(0).args[1]).toEqual(
      'client_id=abc&grant_type=authorization_code&redirect_uri=http%3A%2F%2Fexample.com',
    );
  });
});
