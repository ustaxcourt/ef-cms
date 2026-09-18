import { exchangeAuthCodeInteractor } from '@web-api/business/useCases/auth/exchangeAuthCodeInteractor';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { calculateISODate } from '@shared/business/utilities/DateHandler';
import axios, { AxiosResponse } from 'axios';
import { ServerApplicationContext } from '@web-api/applicationContext';

describe('exchangeAuthCodeInteractor', () => {
  const createISODateStringMock = jest.fn();
  const originalEnv = {
    IDP_NAME: process.env.IDP_NAME,
    MANAGED_LOGIN_DOMAIN: process.env.MANAGED_LOGIN_DOMAIN,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    EFCMS_DOMAIN: process.env.EFCMS_DOMAIN,
    CURRENT_COLOR: process.env.CURRENT_COLOR,
  };

  const mockResult = {
    data: {
      expires_in: 200,
      refresh_token: '1234',
      id_token: '5678gefd',
      access_token: '12341234',
    },
  };
  const mockNow = '2026-09-01T00:00:00.000Z';

  const appContext = {
    ...applicationContext,
    getUtilities: () => {
      return {
        createISODateString: createISODateStringMock,
        calculateISODate,
      };
    },
  };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.IDP_NAME = 'entraId';
    process.env.MANAGED_LOGIN_DOMAIN = 'https://example.com';
    process.env.COGNITO_CLIENT_ID = 'test-client-id';
    process.env.EFCMS_DOMAIN = 'efcms.example.com';
    process.env.CURRENT_COLOR = 'green';

    appContext.getHttpClient().post.mockResolvedValue(mockResult);
    createISODateStringMock.mockReturnValue(mockNow);
  });

  afterAll(() => {
    process.env.IDP_NAME = originalEnv.IDP_NAME;
    process.env.MANAGED_LOGIN_DOMAIN = originalEnv.MANAGED_LOGIN_DOMAIN;
    process.env.COGNITO_CLIENT_ID = originalEnv.COGNITO_CLIENT_ID;
    process.env.EFCMS_DOMAIN = originalEnv.EFCMS_DOMAIN;
    process.env.CURRENT_COLOR = originalEnv.CURRENT_COLOR;
  });

  it('should successfully exchange auth code', async () => {
    const result = await exchangeAuthCodeInteractor(
      appContext as ServerApplicationContext,
      {
        authCode: '1234abcd',
        code_verifier: '1234',
      },
    );

    expect(result).toEqual({
      accessToken: '12341234',
      idToken: '5678gefd',
      refreshToken: '1234',
      expiresAt: '2026-09-02T00:00:00.000Z',
    });

    const expectedCallValue = appContext.getHttpClient().post.mock.calls[0][1];
    expect(expectedCallValue.toString()).toContain(
      'redirect_uri=https%3A%2F%2Fapp.efcms.example.com',
    );
  });

  it('should successfully exchange auth code with Test user', async () => {
    const result = await exchangeAuthCodeInteractor(
      appContext as ServerApplicationContext,
      {
        authCode: '1234abcd',
        code_verifier: '1234',
      },
      true,
    );

    expect(result).toEqual({
      accessToken: '12341234',
      idToken: '5678gefd',
      refreshToken: '1234',
      expiresAt: '2026-09-02T00:00:00.000Z',
    });
    const expectedCallValue = appContext.getHttpClient().post.mock.calls[0][1];
    expect(expectedCallValue.toString()).toContain(
      'redirect_uri=https%3A%2F%2Fapp-green.efcms.example.com',
    );
  });

  it('should throw an error if auth is unsuccessful', async () => {
    appContext.getHttpClient().post.mockRejectedValue(new Error('Bad Request'));
    const callPromise = exchangeAuthCodeInteractor(
      appContext as ServerApplicationContext,
      {
        authCode: '1234abcd',
        code_verifier: '1234',
      },
    );
    await expect(callPromise).rejects.toThrow(new Error('Bad Request'));
  });

  it('should throw an unauthorized error if auth is unsuccessful', async () => {
    appContext.getHttpClient().post.mockRejectedValue(
      new axios.AxiosError(
        'NotAuthorizedException',
        '403',
        undefined,
        undefined,
        {
          status: 403,
        } as AxiosResponse,
      ),
    );

    const callPromise = exchangeAuthCodeInteractor(
      appContext as ServerApplicationContext,
      {
        authCode: '1234abcd',
        code_verifier: '1234',
      },
    );
    await expect(callPromise).rejects.toThrow(
      new UnauthorizedError('Code exchange failed: Unauthorized'),
    );
  });
});
