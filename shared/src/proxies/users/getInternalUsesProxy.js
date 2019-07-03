const { get } = require('../requests');

/**
 * getInternalUsersInteractor
 *
 * @param applicationContext
 * @param caseId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.getInternalUsersInteractor = ({ applicationContext }) => {
  return get({
    applicationContext,
    endpoint: '/users/internal',
  });
};
