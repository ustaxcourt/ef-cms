const { put } = require('../requests');

/**
 * verifyUserPendingEmailInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.verifyUserPendingEmailInteractor = ({ applicationContext, token }) => {
  return put({
    applicationContext,
    body: {
      token,
    },
    endpoint: '/async/users/verify-email',
  });
};
