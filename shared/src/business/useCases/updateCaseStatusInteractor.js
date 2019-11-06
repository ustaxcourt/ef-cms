const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

const { Case } = require('../entities/cases/Case');

/**
 * updateCaseStatusInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {object} providers.caseStatus the status to set on the case
 * @returns {object} the updated case data
 */

exports.updateCaseStatusInteractor = async ({
  applicationContext,
  caseId,
  caseStatus,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const oldCase = applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });

  const newCase = new Case(
    { ...oldCase, status: caseStatus },
    { applicationContext },
  )
    .validate()
    .toRawObject();

  // if this case status is changing FROM calendared
  // we need to remove it from the trial session
  if (
    oldCase.status === Case.STATUS_TYPES.calendared &&
    caseStatus !== oldCase.status
  ) {
    applicationContext.getUseCases().removeCaseFromTrialInteractor({
      applicationContext,
      caseId,
      disposition: `Status was changed to ${caseStatus}`,
      trialSessionId: oldCase.trialSessionId,
    });
  }

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: newCase,
  });
};
