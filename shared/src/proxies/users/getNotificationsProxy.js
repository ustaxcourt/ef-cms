const { get } = require('../requests');

/**
 * getCaseProxy
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
