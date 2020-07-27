const {
  associateIrsPractitionerToCase,
} = require('../../useCaseHelper/caseAssociation/associateIrsPractitionerToCase');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * associateIrsPractitionerWithCaseInteractor
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.caseId the case id
 * @param {string} params.serviceIndicator the type of service the irsPractitioner should receive
 * @param {string} params.userId the user id
 * @returns {*} the result
 */
exports.associateIrsPractitionerWithCaseInteractor = async ({
  applicationContext,
  docketNumber,
  serviceIndicator,
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

  return await associateIrsPractitionerToCase({
    applicationContext,
    docketNumber,
    serviceIndicator,
    user,
  });
};
