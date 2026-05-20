jest.mock('axios');

import {
  DEPLOYMENT_TIMESTAMP_STORAGE_KEY,
  X_DEPLOYMENT_TIMESTAMP,
  X_FORCE_REFRESH,
  X_MANUAL_REFRESH_REQUIRED,
} from '@shared/utils/headers';

describe('httpClient', () => {
  beforeEach(() => {
    jest.resetModules();
    window.localStorage.clear();
  });

  const setupHttpClient = async () => {
    const axiosModule = (await import('axios')).default;
    const mockedAxios = jest.mocked(axiosModule);
    const requestUse = jest.fn();
    const responseUse = jest.fn();
    const mockClient = {
      interceptors: {
        request: { use: requestUse },
        response: { use: responseUse },
      },
    };

    mockedAxios.create.mockReturnValue(mockClient as never);

    const { getHttpClient } = await import('./httpClient');

    return {
      getHttpClient,
      requestUse,
      responseUse,
    };
  };

  it('adds the stored deployment timestamp to outgoing API requests', async () => {
    window.localStorage.setItem(DEPLOYMENT_TIMESTAMP_STORAGE_KEY, '12345');

    const { getHttpClient, requestUse } = await setupHttpClient();
    getHttpClient(jest.fn(), 'http://localhost:4000');

    const requestInterceptor = requestUse.mock.calls[0][0];
    const config = {
      headers: {
        set: jest.fn(),
      },
      url: 'http://localhost:4000/documents/abc/upload-policy',
    };

    requestInterceptor(config);

    expect(config.headers.set).toHaveBeenCalledWith(
      X_DEPLOYMENT_TIMESTAMP,
      '12345',
    );
  });

  it('does not add the deployment timestamp header to external requests (e.g. S3)', async () => {
    window.localStorage.setItem(DEPLOYMENT_TIMESTAMP_STORAGE_KEY, '12345');

    const { getHttpClient, requestUse } = await setupHttpClient();
    getHttpClient(jest.fn(), 'http://localhost:4000');

    const requestInterceptor = requestUse.mock.calls[0][0];
    const config = {
      headers: {
        set: jest.fn(),
      },
      url: 'https://s3.us-east-1.amazonaws.com/some-bucket',
    };

    requestInterceptor(config);

    expect(config.headers.set).not.toHaveBeenCalled();
  });

  it('does not add the deployment timestamp header to a URL with a similar prefix but different port', async () => {
    window.localStorage.setItem(DEPLOYMENT_TIMESTAMP_STORAGE_KEY, '12345');

    const { getHttpClient, requestUse } = await setupHttpClient();
    getHttpClient(jest.fn(), 'http://localhost:4000');

    const requestInterceptor = requestUse.mock.calls[0][0];
    const config = {
      headers: {
        set: jest.fn(),
      },
      url: 'http://localhost:40000/some-path',
    };

    requestInterceptor(config);

    expect(config.headers.set).not.toHaveBeenCalled();
  });

  it('stores the backend deployment timestamp from successful responses', async () => {
    const { getHttpClient, responseUse } = await setupHttpClient();
    getHttpClient(jest.fn(), 'http://localhost:4000');

    const successInterceptor = responseUse.mock.calls[0][0];

    successInterceptor({
      headers: {
        get: (headerName: string) => {
          if (headerName === X_DEPLOYMENT_TIMESTAMP) {
            return '67890';
          }
        },
      },
    });

    expect(
      window.localStorage.getItem(DEPLOYMENT_TIMESTAMP_STORAGE_KEY),
    ).toEqual('67890');
  });

  it('captures a per-request stack trace on the request interceptor and applies it to errors', async () => {
    const { getHttpClient, requestUse, responseUse } = await setupHttpClient();
    getHttpClient(jest.fn(), 'http://localhost:4000');

    const requestInterceptor = requestUse.mock.calls[0][0];
    const errorInterceptor = responseUse.mock.calls[0][1];

    const config = { headers: { set: jest.fn() } };
    const configWithStack = requestInterceptor(config);
    expect(configWithStack._stackError).toBeInstanceOf(Error);

    const error = {
      config: configWithStack,
      response: { headers: {} },
      stack: 'original stack',
    };

    await expect(errorInterceptor(error)).rejects.toBe(error);
    expect(error.stack).toBe(configWithStack._stackError.stack);
  });

  it('forces a refresh when the backend sends X-Force-Refresh: true', async () => {
    const forceRefreshCallback = jest.fn();

    const { getHttpClient, responseUse } = await setupHttpClient();
    getHttpClient(forceRefreshCallback, 'http://localhost:4000');

    const errorInterceptor = responseUse.mock.calls[0][1];
    const error = {
      response: {
        headers: {
          get: (headerName: string) => {
            if (headerName === X_FORCE_REFRESH) {
              return 'true';
            }
          },
        },
      },
    };

    await expect(errorInterceptor(error)).rejects.toBe(error);
    expect(forceRefreshCallback).toHaveBeenCalled();
  });

  it('forces a manual refresh when the backend signals it', async () => {
    const forceRefreshCallback = jest.fn();

    const { getHttpClient, responseUse } = await setupHttpClient();
    getHttpClient(forceRefreshCallback, 'http://localhost:4000');

    const errorInterceptor = responseUse.mock.calls[0][1];
    const error = {
      response: {
        headers: {
          get: (headerName: string) => {
            if (headerName === X_DEPLOYMENT_TIMESTAMP) {
              return '99999';
            }

            if (headerName === X_MANUAL_REFRESH_REQUIRED) {
              return 'true';
            }
          },
        },
      },
    };

    await expect(errorInterceptor(error)).rejects.toBe(error);
    expect(forceRefreshCallback).toHaveBeenCalled();
    expect(
      window.localStorage.getItem(DEPLOYMENT_TIMESTAMP_STORAGE_KEY),
    ).toEqual('99999');
  });
});
