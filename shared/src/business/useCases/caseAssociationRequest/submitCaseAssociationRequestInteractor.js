const {
  associatePractitionerToCase,
} = require('../../useCaseHelper/caseAssociation/associatePractitionerToCase');
const {
  associateRespondentToCase,
} = require('../../useCaseHelper/caseAssociation/associateRespondentToCase');
const { UnauthorizedError } = require('../../../errors/errors');
const {
  ASSOCIATE_SELF_WITH_CASE,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');

/**
 * submitCaseAssociationRequestInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id
 * @param {string} providers.representingPrimary true if the user is representing
 * the primary contact on the case, false otherwise
 * @param {string} providers.representingSecondary true if the user is representing
 * the secondary contact on the case, false otherwise
 * @returns {Promise<*>} the promise of the case assocation request
 */
exports.submitCaseAssociationRequestInteractor = async ({
  applicationContext,
  caseId,
  representingPrimary,
  representingSecondary,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ASSOCIATE_SELF_WITH_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const isPractitioner = authorizedUser.role === 'practitioner';
  const isRespondent = authorizedUser.role === 'respondent';

  if (isPractitioner) {
    return await associatePractitionerToCase({
      applicationContext,
      caseId,
      representingPrimary,
      representingSecondary,
      user,
    });
  } else if (isRespondent) {
    return await associateRespondentToCase({
      applicationContext,
      caseId,
      user,
    });
  }
};
