const { get } = require('../requests');

/**
 * getCaseProxy
 *
 * @param applicationContext
 * @param caseId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.getInternalUsers = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: '/users/internal',
  });
};
