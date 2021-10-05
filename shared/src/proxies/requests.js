const moize = require('moize').default;

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
  const token = applicationContext.getCurrentUserToken();
  return await applicationContext
    .getHttpClient()
    .head(`${applicationContext.getBaseUrl()}${endpoint}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      params,
    })
    .then(response => response.data);
};

/**
 *
 * get
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.endpoint the endpoint to call
 * @param {object} providers.params the params to send to the endpoint
 * @returns {Promise<*>} the response data
 */
const get = async ({ applicationContext, endpoint, params }) => {
  const token = applicationContext.getCurrentUserToken();
  return await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}${endpoint}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      params,
    })
    .then(response => response.data);
};

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
 * @returns {Promise<*>} the response data
 */
exports.post = async ({
  applicationContext,
  body,
  endpoint,
  headers = {},
  options = {},
}) => {
  getMemoized.clear();
  return await applicationContext
    .getHttpClient()
    .post(`${applicationContext.getBaseUrl()}${endpoint}`, body, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
        ...headers,
      },
      ...options,
    })
    .then(response => response.data);
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
exports.put = async ({ applicationContext, body, endpoint }) => {
  getMemoized.clear();
  return await applicationContext
    .getHttpClient()
    .put(`${applicationContext.getBaseUrl()}${endpoint}`, body, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    })
    .then(response => response.data);
};
/**
 *
 * remove
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.endpoint the endpoint to call
 * @param {object} providers.params the params to send to the endpoint
 * @returns {Promise<*>} the response data
 */
exports.remove = async ({ applicationContext, endpoint, params }) => {
  getMemoized.clear();
  return await applicationContext
    .getHttpClient()
    .delete(`${applicationContext.getBaseUrl()}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
      params,
    })
    .then(response => response.data);
};
