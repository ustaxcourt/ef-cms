const { get } = require('../requests');

/**
 * getCaseProxy
 *
 * @param applicationContext
 * @param caseId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.getUsersInSection = ({ applicationContext, section }) => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/users`,
  });
};
