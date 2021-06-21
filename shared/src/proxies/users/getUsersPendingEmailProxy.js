const { get } = require('../requests');

/**
 * getUsersPendingEmailInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userIds the userIds to check for pending emails
 * @returns {Promise<*>} the promise of the api call
 */
exports.getUsersPendingEmailInteractor = (applicationContext, { userIds }) => {
  return get({
    applicationContext,
    endpoint: `/users/pending-email?userIds=${userIds.join(',')}`,
  });
};
