const { get } = require('../requests');

/**
 * getUserPendingEmailInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.pendingEmail the pendingEmail to update the pendingEmail
 * @param {string} providers.userId the userId to update the pendingEmail
 * @returns {Promise<*>} the promise of the api call
 */
exports.getUserPendingEmailInteractor = (applicationContext, { userId }) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/pending-email`,
  });
};
