import { exchangeAuthCodeInteractor } from '@web-api/business/useCases/auth/exchangeAuthCodeInteractor';
import { UnauthorizedError } from '@web-api/errors/errors';

describe('exchangeAuthCodeInteractor', () => {
  it('should successfully exchange auth code', async () => {
    const mockResult = {
      data: {
        expires_in: 200,
        refresh_token: '1234',
        id_token: '5678gefd',
        access_token: '12341234',
      },
    };
    const result = await exchangeAuthCodeInteractor(
      {
        getHttpClient: () => {
          return {
            CancelToken: {
              source: () => ({
                cancel: () => null,
              }),
            },
            post: () => Promise.resolve(mockResult),
          };
        },
      } as any,
      { authCode: '1234abcd' },
    );
    expect(result).toEqual({
      accessToken: '12341234',
      idToken: '5678gefd',
      refreshToken: '1234',
      expiresAt: 200,
    });
  });

  it('should throw an error if auth is unsuccessful', async () => {
    const callPromise = exchangeAuthCodeInteractor(
      {
        getHttpClient: () => {
          return {
            CancelToken: {
              source: () => ({
                cancel: () => null,
              }),
            },
            post: () => Promise.reject(new Error('Bad Request')),
          };
        },
      } as any,
      { authCode: '1234abcd' },
    );
    await expect(callPromise).rejects.toThrow(new Error('Bad Request'));
  });

  it('should throw an unauthorized error if auth is unsuccessful', async () => {
    const callPromise = exchangeAuthCodeInteractor(
      {
        getHttpClient: () => {
          return {
            CancelToken: {
              source: () => ({
                cancel: () => null,
              }),
            },
            post: () =>
              Promise.reject({ name: 'NotAuthorizedException' } as Error),
          };
        },
      } as any,
      { authCode: '1234abcd' },
    );
    await expect(callPromise).rejects.toThrow(
      new UnauthorizedError('Invalid refresh token'),
    );
  });
});
