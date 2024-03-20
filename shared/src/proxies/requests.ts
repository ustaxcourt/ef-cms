import moize from 'moize';

const MAX_RETRIES = 10;

/**
 *
 *head
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.endpoint the endpoint to call
 * @param {object} providers.params the params to send to the endpoint
 * @returns {Promise<*>} the response data
 */
export const head = async ({ applicationContext, endpoint, params }) => {
  return await applicationContext
    .getHttpClient()
    .head(`${applicationContext.getBaseUrl()}${endpoint}`, {
      headers: getDefaultHeaders(applicationContext.getCurrentUserToken()),
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
  endpoint,
  params,
}: {
  applicationContext: IApplicationContext;
  endpoint: string;
  params?: any;
}) => {
  const response = await getResponse({
    applicationContext,
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
export const getResponse = ({ applicationContext, endpoint, params }) => {
  return applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}${endpoint}`, {
      headers: getDefaultHeaders(applicationContext.getCurrentUserToken()),
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
  retry = 0,
}) => {
  getMemoized.clear();
  try {
    return await applicationContext
      .getHttpClient()
      .post(`${applicationContext.getBaseUrl()}${endpoint}`, body, {
        headers: {
          ...getDefaultHeaders(applicationContext.getCurrentUserToken()),
          ...headers,
          Asyncsyncid: asyncSyncId,
        },
        ...options,
      })
      .then(response => response.data);
  } catch (err) {
    if (isRetryableError({ err, retry })) {
      await applicationContext
        .getUtilities()
        .sleep(err.response?.headers['Retry-After'] || 5000);
      return post({
        applicationContext,
        asyncSyncId,
        body,
        endpoint,
        retry: retry + 1,
      });
    }
    throw err;
  }
};

export const asyncSyncHandler = (
  applicationContext,
  request,
  asyncSyncId = applicationContext.getUniqueId(),
) => {
  getMemoized.clear();

  return new Promise((resolve, reject) => {
    const callback = results => {
      if (results.statusCode === '200') {
        resolve(results.body);
      }
      reject(results);
    };

    applicationContext
      .getAsynSyncUtil()
      .setAsyncSyncCompleter(asyncSyncId, callback);

    request(asyncSyncId);
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
  retry = 0,
}) => {
  getMemoized.clear();
  try {
    const res = await applicationContext
      .getHttpClient()
      .put(`${applicationContext.getBaseUrl()}${endpoint}`, body, {
        headers: {
          ...getDefaultHeaders(applicationContext.getCurrentUserToken()),
          Asyncsyncid: asyncSyncId,
        },
      })
      .then(response => response.data);

    return res;
  } catch (err) {
    if (isRetryableError({ err, retry })) {
      await applicationContext
        .getUtilities()
        .sleep(err.response?.headers['Retry-After'] || 5000);
      return put({
        applicationContext,
        asyncSyncId,
        body,
        endpoint,
        retry: retry + 1,
      });
    }
    throw err;
  }
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
  options = {},
  params = {},
  retry = 0,
}: {
  applicationContext: any;
  endpoint: string;
  options?: any;
  params?: any;
  retry?: number;
}) => {
  getMemoized.clear();
  try {
    return await applicationContext
      .getHttpClient()
      .delete(`${applicationContext.getBaseUrl()}${endpoint}`, {
        headers: getDefaultHeaders(applicationContext.getCurrentUserToken()),
        params,
        ...options,
      })
      .then(response => response.data);
  } catch (err) {
    if (isRetryableError({ err, retry })) {
      await applicationContext
        .getUtilities()
        .sleep(err.response?.headers['Retry-After'] || 5000);
      return remove({
        applicationContext,
        endpoint,
        params,
        ...options,
        retry: retry + 1,
      });
    }
    throw err;
  }
};

const getDefaultHeaders = userToken => {
  const authorization = userToken ? `Bearer ${userToken}` : undefined;

  let authorizationHeaderObject = {};
  if (authorization) {
    authorizationHeaderObject['Authorization'] = authorization;
  }

  return authorizationHeaderObject;
};

const isRetryableError = ({ err, retry }) => {
  return err.response && err.response.status === 503 && retry < MAX_RETRIES;
};
