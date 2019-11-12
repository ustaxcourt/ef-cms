const {
  associatePractitionerToCase,
} = require('../../useCaseHelper/caseAssociation/associatePractitionerToCase');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * associatePractitionerWithCaseInteractor
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.caseId the case id
 * @param {boolean} params.representingPrimary whether the practitioner is
 * representing the primary contact
 * @param {boolean} params.representingSecondary whether the practitioner is
 * representing the secondary contact
 * @param {string} params.userId the user id
 * @returns {*} the result
 */
exports.associatePractitionerWithCaseInteractor = async ({
  applicationContext,
  caseId,
  representingPrimary,
  representingSecondary,
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

  return await associatePractitionerToCase({
    applicationContext,
    caseId,
    representingPrimary,
    representingSecondary,
    user,
  });
};
