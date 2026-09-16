import { exchangeAuthCodeInteractor } from '@web-api/business/useCases/auth/exchangeAuthCodeInteractor';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import { AxiosError } from 'node_modules/axios/index.cjs';

describe('exchangeAuthCodeInteractor', () => {
  it('should successfully exchange auth code', async () => {
    const mockNow = '2026-09-01T00:00:00.000Z';
    const createISODateString = jest.fn().mockReturnValue(mockNow);

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
        ...applicationContext,
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
        getUtilities: () => {
          return {
            createISODateString,
            calculateISODate,
          };
        },
      } as any,
      { authCode: '1234abcd', code_verifier: '1234' },
    );
    expect(result).toEqual({
      accessToken: '12341234',
      idToken: '5678gefd',
      refreshToken: '1234',
      expiresAt: '2026-09-02T00:00:00.000Z',
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
      { authCode: '1234abcd', code_verifier: '1234' },
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
              Promise.reject({
                name: 'NotAuthorizedException',
                response: { status: 403 },
              } as AxiosError),
          };
        },
      } as any,
      { authCode: '1234abcd', code_verifier: '1234' },
    );
    await expect(callPromise).rejects.toThrow(
      new UnauthorizedError('Code exchange failed: Unauthorized'),
    );
  });
});
