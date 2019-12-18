const {
  associateRespondentToCase,
} = require('../../useCaseHelper/caseAssociation/associateRespondentToCase');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * associateRespondentWithCaseInteractor
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.caseId the case id
 * @param {string} params.userId the user id
 * @returns {*} the result
 */
exports.associateRespondentWithCaseInteractor = async ({
  applicationContext,
  caseId,
  userId,
}) => {
  const authenticatedUser = applicationContext.getCurrentUser();

  if (
    !isAuthorized(authenticatedUser, ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  return await associateRespondentToCase({
    applicationContext,
    caseId,
    user,
  });
};
