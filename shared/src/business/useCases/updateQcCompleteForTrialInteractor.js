const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * updateQcCompleteForTrialInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {boolean} providers.qcCompleteForTrial true if case is qc complete for trial, false otherwise
 * @param {string} providers.trialSessionId the id of the trial session to update
 * @returns {Promise<object>} the updated case data
 */
exports.updateQcCompleteForTrialInteractor = async ({
  applicationContext,
  caseId,
  qcCompleteForTrial,
  trialSessionId,
}) => {
  console.time('stuff');
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSION_QC_COMPLETE)) {
    throw new UnauthorizedError('Unauthorized for trial session QC complete');
  }

  console.time('oldCase');
  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });
  console.timeEnd('oldCase');

  const newCase = new Case(oldCase, { applicationContext });

  newCase.setQcCompleteForTrial({ qcCompleteForTrial, trialSessionId });

  console.time('updateCase');
  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: newCase.validate().toRawObject(),
    });
  console.timeEnd('updateCase');

  console.timeEnd('stuff');

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
