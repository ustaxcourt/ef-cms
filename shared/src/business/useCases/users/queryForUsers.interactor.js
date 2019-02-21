const {
  isAuthorized,
  GET_USERS_IN_SECTION,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * queryForUsers
 *
 * @param section
 * @param applicationContext
 * @returns {Promise<*|{caseId}>}
 */
exports.queryForUsers = ({ section, applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  if (section) {
    if (!isAuthorized(user, GET_USERS_IN_SECTION)) {
      throw new UnauthorizedError('Unauthorized');
    }
    return applicationContext.getPersistenceGateway().getUsersInSection({
      section,
      applicationContext,
    });
  } else {
    if (!isAuthorized(user, WORKITEM)) {
      throw new UnauthorizedError('Unauthorized');
    }

    return applicationContext.getPersistenceGateway().getInternalUsers({
      applicationContext,
    });
  }
};
