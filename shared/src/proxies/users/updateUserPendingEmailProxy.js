const { put } = require('../requests');

/**
 * updateUserPendingEmailInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.pendingEmail the pendingEmail to update the pendingEmail
 * @param {string} providers.userId the userId to update the pendingEmail
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateUserPendingEmailInteractor = (
  applicationContext,
  { pendingEmail },
) => {
  return put({
    applicationContext,
    body: {
      pendingEmail,
    },
    endpoint: '/users/pending-email',
  });
};
