import { ClientApplicationContext } from '@web-client/applicationContext';
import { ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import moize from 'moize';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';

export type RequestApplicationContext =
  | ClientApplicationContext
  | ClientPublicApplicationContext;

let token: string = '';
export const getCurrentUserToken = (): string => {
  return token;
};
export const setCurrentUserToken = (newToken: string) => {
  token = newToken;
};

export const head = async ({
  applicationContext,
  endpoint,
  params,
}: {
  applicationContext: RequestApplicationContext;
  endpoint: string;
  params?: Record<string, any>;
}) => {
  return await applicationContext
    .getHttpClient()
    .head(`${applicationContext.getBaseUrl()}${endpoint}`, {
      headers: getDefaultHeaders(getCurrentUserToken()),
      params,
    })
    .then(response => response.data);
};

const internalGet = async ({
  applicationContext,
  asyncSyncId = undefined,
  endpoint,
  params,
}: {
  applicationContext: RequestApplicationContext;
  endpoint: string;
  asyncSyncId?: string;
  params?: any;
}) => {
  const response = await getResponse({
    applicationContext,
    asyncSyncId,
    endpoint,
    params,
  });
  return response.data;
};

export const getResponse = ({
  applicationContext,
  asyncSyncId,
  endpoint,
  params,
}: {
  applicationContext: RequestApplicationContext;
  endpoint: string;
  asyncSyncId?: string;
  params?: Record<string, any>;
}) => {
  return applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}${endpoint}`, {
      headers: {
        ...getDefaultHeaders(getCurrentUserToken()),
        Asyncsyncid: asyncSyncId,
      },
      params,
    });
};

const getMemoized = moize({
  equals(cacheKeyArgument, keyArgument) {
    return cacheKeyArgument.endpoint === keyArgument.endpoint;
  },
  isPromise: true,
  maxAge: 5 * 1000, // five seconds
  updateExpire: true,
})(internalGet);

const memoizedOrInternal = process.env.CI ? internalGet : getMemoized;

export const get = (args: Parameters<typeof internalGet>[0] & { skipCache?: boolean }) => {
  const { skipCache, ...rest } = args;
  return skipCache ? internalGet(rest) : memoizedOrInternal(rest);
};

export const post = async ({
  applicationContext,
  asyncSyncId = undefined,
  body = {},
  endpoint,
  headers = {},
  options = {},
}: {
  applicationContext: RequestApplicationContext;
  asyncSyncId?: string;
  body?: unknown;
  endpoint: string;
  headers?: Record<string, unknown>;
  options?: Record<string, unknown>;
}) => {
  getMemoized.clear();
  return await applicationContext
    .getHttpClient()
    .post(`${applicationContext.getBaseUrl()}${endpoint}`, body, {
      headers: {
        ...getDefaultHeaders(getCurrentUserToken()),
        ...headers,
        Asyncsyncid: asyncSyncId,
      },
      ...options,
    })
    .then(response => response.data);
};

export const asyncSyncHandler = (
  applicationContext: ClientApplicationContext,
  request: (asyncSyncId: string) => void,
  asyncSyncId = applicationContext.getUniqueId(),
) => {
  getMemoized.clear();

  return new Promise((resolve, reject) => {
    const callback = (results: { statusCode: number; body?: string }) => {
      if (+results.statusCode === 200) {
        resolve(results.body);
      } else {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(results);
      }
    };

    request(asyncSyncId);

    const nowSeconds = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
    const futureSeconds = 16 * 60;
    const expirationTimestamp = nowSeconds + futureSeconds;
    applicationContext
      .getUseCases()
      .startPollingForResultsInteractor(
        applicationContext,
        asyncSyncId,
        expirationTimestamp,
        callback,
      );
  });
};

export const put = async ({
  applicationContext,
  asyncSyncId = undefined,
  body,
  endpoint,
}: {
  applicationContext: RequestApplicationContext;
  asyncSyncId?: string;
  body?: Record<string, any>;
  endpoint: string;
}) => {
  getMemoized.clear();
  const res = await applicationContext
    .getHttpClient()
    .put(`${applicationContext.getBaseUrl()}${endpoint}`, body, {
      headers: {
        ...getDefaultHeaders(getCurrentUserToken()),
        Asyncsyncid: asyncSyncId,
      },
    })
    .then(response => response.data);

  return res;
};

export const remove = async ({
  applicationContext,
  endpoint,
  asyncSyncId = undefined,
  options = {},
  params = {},
}: {
  applicationContext: RequestApplicationContext;
  endpoint: string;
  options?: Record<string, unknown>;
  asyncSyncId?: string;
  params?: Record<string, unknown>;
}) => {
  getMemoized.clear();
  return await applicationContext
    .getHttpClient()
    .delete(`${applicationContext.getBaseUrl()}${endpoint}`, {
      headers: {
        ...getDefaultHeaders(getCurrentUserToken()),
        Asyncsyncid: asyncSyncId,
      },
      params,
      ...options,
    })
    .then(response => response.data);
};

const getDefaultHeaders = (userToken: string | undefined) => {
  const authorization = userToken ? `Bearer ${userToken}` : undefined;

  const authorizationHeaderObject = {};
  if (authorization) {
    authorizationHeaderObject['Authorization'] = authorization;
  }

  return authorizationHeaderObject;
};
