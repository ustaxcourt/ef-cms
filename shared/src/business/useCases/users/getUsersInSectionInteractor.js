const {
  GET_USERS_IN_SECTION,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
/**
 * getUsersInSection
 *
 * @param section
 * @param applicationContext
 * @returns {Promise<*|{caseId}>}
 */
exports.getUsersInSection = ({ applicationContext, section }) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, GET_USERS_IN_SECTION)) {
    throw new UnauthorizedError('Unauthorized');
  }
  return applicationContext.getPersistenceGateway().getUsersInSection({
    applicationContext,
    section,
  });
};
