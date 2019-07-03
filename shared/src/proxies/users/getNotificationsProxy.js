const { get } = require('../requests');

/**
 * getNotifications
 *
 * @param applicationContext
 * @param caseId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.getNotifications = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: '/notifications',
  });
};
