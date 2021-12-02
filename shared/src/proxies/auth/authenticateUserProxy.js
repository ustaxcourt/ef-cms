const { post } = require('../requests');

/**
 * authenticateUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {Promise<*>} the promise of the api call
 */
exports.authenticateUserInteractor = (applicationContext, { code }) => {
  return post({
    applicationContext,
    body: { code },
    endpoint: '/auth/login',
    options: {
      withCredentials: true,
    },
  });
};
