const moize = require('moize').default;
const maxRetries = 5;

/**
 *
 * head
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.endpoint the endpoint to call
 * @param {object} providers.params the params to send to the endpoint
 * @returns {Promise<*>} the response data
 */
exports.head = async ({ applicationContext, endpoint, params }) => {
  return await applicationContext
    .getHttpClient()
    .head(`${applicationContext.getBaseUrl()}${endpoint}`, {
      headers: getDefaultHeaders(applicationContext.getCurrentUserToken()),
      params,
    })
    .then(response => response.data)
    .catch(err => err);
};

/**
 *
 * get
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.endpoint the endpoint to call
 * @param {object} providers.params the params to send to the endpoint
 * @returns {Promise<*>} the response body data
 */
const get = async ({ applicationContext, endpoint, params }) => {
  const response = await getResponse({
    applicationContext,
    endpoint,
    params,
  });
  return response.data;
};

/**
 *
 * getResponse
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.endpoint the endpoint to call
 * @param {object} providers.params the params to send to the endpoint
 * @returns {Promise<*>} the complete http response
 */
const getResponse = ({ applicationContext, endpoint, params }) => {
  return applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}${endpoint}`, {
      headers: getDefaultHeaders(applicationContext.getCurrentUserToken()),
      params,
    });
};

exports.getResponse = getResponse;

const getMemoized = moize({
  equals(cacheKeyArgument, keyArgument) {
    return cacheKeyArgument.endpoint === keyArgument.endpoint;
  },
  isPromise: true,
  maxAge: 5 * 1000, // five seconds
  updateExpire: true,
})(get);

exports.get = process.env.CI ? get : getMemoized;

/**
 *
 * post
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.body the body to send with the request
 * @param {string} providers.endpoint the endpoint to call
 * @param {object} providers.options the options we can pass through to the http client
 * @returns {Promise<*>} the response data
 */
exports.post = async ({
  applicationContext,
  body,
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
        },
        ...options,
      })
      .then(response => response.data);
  } catch (err) {
    if (err.response.status === 503 && retry < maxRetries) {
      await applicationContext
        .getUtilities()
        .sleep(err.response.headers['Retry-After'] || 5000);
      return exports.post({
        applicationContext,
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
 * put
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.body the body to send with the request
 * @param {string} providers.endpoint the endpoint to call
 * @returns {Promise<*>} the response data
 */
exports.put = async ({ applicationContext, body, endpoint, retry = 0 }) => {
  getMemoized.clear();
  try {
    const res = await applicationContext
      .getHttpClient()
      .put(`${applicationContext.getBaseUrl()}${endpoint}`, body, {
        headers: getDefaultHeaders(applicationContext.getCurrentUserToken()),
      })
      .then(response => response.data);

    return res;
  } catch (err) {
    if (err.response.status === 503 && retry < maxRetries) {
      await applicationContext
        .getUtilities()
        .sleep(err.response.headers['Retry-After'] || 5000);
      return exports.put({
        applicationContext,
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
 * remove
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.endpoint the endpoint to call
 * @param {object} providers.params the params to send to the endpoint
 * @param {object} providers.options the options we can pass through to the http client
 * @returns {Promise<*>} the response data
 */
exports.remove = async ({
  applicationContext,
  endpoint,
  options = {},
  params,
  retry = 0,
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
    if (err.response.status === 503 && retry < maxRetries) {
      await applicationContext
        .getUtilities()
        .sleep(err.response.headers['Retry-After'] || 5000);
      return exports.remove({
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
