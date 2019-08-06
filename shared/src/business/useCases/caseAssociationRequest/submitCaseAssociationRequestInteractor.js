const {
  associatePractitionerToCase,
} = require('../../useCaseHelper/caseAssociation/associatePractitionerToCase');
const {
  associateRespondentToCase,
} = require('../../useCaseHelper/caseAssociation/associateRespondentToCase');
const { UnauthorizedError } = require('../../../errors/errors');

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
  const user = applicationContext.getCurrentUser();

  const isPractitioner = user.role === 'practitioner';
  const isRespondent = user.role === 'respondent';

  if (!isPractitioner && !isRespondent) {
    throw new UnauthorizedError('Unauthorized');
  }

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
