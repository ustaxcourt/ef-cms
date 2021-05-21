const { get } = require('../requests');

/**
 * getUsersPendingEmailStatusesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the userIds to check for pending email statuses
 * @returns {Promise<*>} the promise of the api call
 */
exports.getUsersPendingEmailStatusesInteractor = ({
  applicationContext,
  userIds,
}) => {
  return get({
    applicationContext,
    endpoint: '/users/pending-email-status',
    params: { userIds },
  });
};
