const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * setConsolidatedCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseId the id of the case to consolidate
 * @param {object} providers.leadCaseId the id of the lead case for consolidation
 * @returns {object} the updated case data
 */
exports.setConsolidatedCaseInteractor = async ({
  applicationContext,
  caseId,
  leadCaseId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CONSOLIDATE_CASES)) {
    throw new UnauthorizedError('Unauthorized for case consolidation');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });

  caseToUpdate.setLeadCase(leadCaseId);

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseToUpdate.validate().toRawObject(),
  });
};
