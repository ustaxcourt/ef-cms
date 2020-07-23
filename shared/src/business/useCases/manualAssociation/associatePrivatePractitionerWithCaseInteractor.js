const {
  associatePrivatePractitionerToCase,
} = require('../../useCaseHelper/caseAssociation/associatePrivatePractitionerToCase');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * associatePrivatePractitionerWithCaseInteractor
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.docketNumber the docket number of the case
 * @param {boolean} params.representingPrimary whether the practitioner is
 * representing the primary contact
 * @param {boolean} params.representingSecondary whether the practitioner is
 * representing the secondary contact
 * @param {string} params.userId the user id
 * @returns {*} the result
 */
exports.associatePrivatePractitionerWithCaseInteractor = async ({
  applicationContext,
  docketNumber,
  representingPrimary,
  representingSecondary,
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

  return await associatePrivatePractitionerToCase({
    applicationContext,
    docketNumber,
    representingPrimary,
    representingSecondary,
    serviceIndicator,
    user,
  });
};
