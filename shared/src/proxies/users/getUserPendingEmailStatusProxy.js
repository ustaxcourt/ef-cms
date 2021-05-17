const { get } = require('../requests');

/**
 * getUserPendingEmailStatusInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.pendingEmail the pendingEmail to update the pendingEmail
 * @param {string} providers.userId the userId to update the pendingEmail
 * @returns {Promise<*>} the promise of the api call
 */
exports.getUserPendingEmailStatusInteractor = ({
  applicationContext,
  userId,
}) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/pending-email-status`,
  });
};
