import { ClientApplicationContext } from '@web-client/applicationContext';
import moize from 'moize';

let token: string = '';
export const getCurrentUserToken = (): string => {
  return token;
};
export const setCurrentUserToken = (newToken: string) => {
  token = newToken;
};

/**
 *
 *head
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.endpoint the endpoint to call
 * @param {object} providers.params the params to send to the endpoint
 * @returns {Promise<*>} the response data
 */
export const head = async ({
  applicationContext,
  endpoint,
  params,
}: {
  applicationContext: ClientApplicationContext;
  endpoint: string;
  params?: any;
}) => {
  return await applicationContext
    .getHttpClient()
    .head(`${applicationContext.getBaseUrl()}${endpoint}`, {
      headers: getDefaultHeaders(getCurrentUserToken()),
      params,
    })
    .then(response => response.data);
};

/**
 *
 *get
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.endpoint the endpoint to call
 * @param {object} providers.params the params to send to the endpoint
 * @returns {Promise<*>} the response body data
 */
const internalGet = async ({
  applicationContext,
  asyncSyncId = undefined,
  endpoint,
  params,
}: {
  applicationContext: ClientApplicationContext;
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

/**
 *
 *getResponse
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.endpoint the endpoint to call
 * @param {object} providers.params the params to send to the endpoint
 * @returns {Promise<*>} the complete http response
 */
export const getResponse = ({
  applicationContext,
  asyncSyncId,
  endpoint,
  params,
}: {
  applicationContext: ClientApplicationContext;
  asyncSyncId?: string;
  endpoint: string;
  params?: any;
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

export const get = process.env.CI ? internalGet : getMemoized;

/**
 *
 *post
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.body the body to send with the request
 * @param {string} providers.endpoint the endpoint to call
 * @param {object} providers.options the options we can pass through to the http client
 * @returns {Promise<*>} the response data
 */
export const post = async ({
  applicationContext,
  asyncSyncId = undefined,
  body = {},
  endpoint,
  headers = {},
  options = {},
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
  applicationContext,
  request,
  asyncSyncId = applicationContext.getUniqueId(),
) => {
  getMemoized.clear();

  return new Promise((resolve, reject) => {
    const callback = results => {
      if (+results.statusCode === 200) {
        resolve(results.body);
      } else {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(results);
      }
    };

    request(asyncSyncId);

    const expirationTimestamp = Math.floor(Date.now() / 1000) + 16 * 60;
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

/**
 *
 *put
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.body the body to send with the request
 * @param {string} providers.endpoint the endpoint to call
 * @returns {Promise<*>} the response data
 */

export const put = async ({
  applicationContext,
  asyncSyncId = undefined,
  body,
  endpoint,
}: {
  applicationContext: ClientApplicationContext;
  asyncSyncId?: string;
  body?: any;
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
/**
 *
 *remove
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.endpoint the endpoint to call
 * @param {object} providers.params the params to send to the endpoint
 * @param {object} providers.options the options we can pass through to the http client
 * @returns {Promise<*>} the response data
 */
export const remove = async ({
  applicationContext,
  endpoint,
  asyncSyncId = undefined,
  options = {},
  params = {},
}: {
  applicationContext: any;
  endpoint: string;
  options?: any;
  asyncSyncId?: string;
  params?: any;
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

const getDefaultHeaders = userToken => {
  const authorization = userToken ? `Bearer ${userToken}` : undefined;

  const authorizationHeaderObject = {};
  if (authorization) {
    authorizationHeaderObject['Authorization'] = authorization;
  }

  return authorizationHeaderObject;
};
