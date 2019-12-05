const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

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

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  caseEntity.setLeadCase(leadCaseId);

  // TODO: Need to create a mapping record

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};
