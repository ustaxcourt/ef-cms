const {
  isAuthorized,
  GET_USERS_IN_SECTION,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
/**
 * getUsersInSection
 *
 * @param section
 * @param applicationContext
 * @returns {Promise<*|{caseId}>}
 */
exports.getUsersInSection = ({ section, applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, GET_USERS_IN_SECTION)) {
    throw new UnauthorizedError('Unauthorized');
  }
  return applicationContext.getPersistenceGateway().getUsersInSection({
    section,
    applicationContext,
  });
};
