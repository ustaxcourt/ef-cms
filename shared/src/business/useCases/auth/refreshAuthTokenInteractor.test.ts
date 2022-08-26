const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { refreshAuthTokenInteractor } = require('./refreshAuthTokenInteractor');

describe('refreshAuthTokenInteractor', () => {
  beforeEach(() => {
    applicationContext.getPersistenceGateway().refreshToken.mockReturnValue({
      token: 'abc',
    });
  });

  it('attempts to hit cognito and get an id token and refresh token', async () => {
    const expectedRefresh = 'sometoken';
    const result = await refreshAuthTokenInteractor(applicationContext, {
      refreshToken: expectedRefresh,
    });
    expect(
      applicationContext.getPersistenceGateway().refreshToken.mock.calls[0][1],
    ).toEqual({ refreshToken: expectedRefresh });
    expect(result).toEqual({
      token: 'abc',
    });
  });

  it('throws an exception if not refresh token is passed in', async () => {
    await expect(
      refreshAuthTokenInteractor(applicationContext, {
        refreshToken: undefined,
      }),
    ).rejects.toThrow('refreshToken is required');
  });
});
