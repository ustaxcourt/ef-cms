const { get } = require('../requests');

/**
 * getNotificationsInteractor
 *
 * @param applicationContext
 * @param caseId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.getNotificationsInteractor = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: '/api/notifications',
  });
};
