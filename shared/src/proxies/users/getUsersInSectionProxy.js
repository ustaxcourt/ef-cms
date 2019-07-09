const { get } = require('../requests');

/**
 * getUsersInSectionInteractor
 *
 * @param applicationContext
 * @param caseId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.getUsersInSectionInteractor = ({ applicationContext, section }) => {
  return get({
    applicationContext,
    endpoint: `/api/sections/${section}/users`,
  });
};
