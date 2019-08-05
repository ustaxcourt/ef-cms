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
 * @param params
 * @param params.caseId
 * @param params.applicationContext
 * @returns {Promise<*>}
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
