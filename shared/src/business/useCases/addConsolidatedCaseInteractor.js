const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

/**
 * addConsolidatedCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseId the id of the case to consolidate
 * @param {object} providers.leadCaseId the id of the lead case for consolidation
 * @returns {object} the updated case data
 */
exports.addConsolidatedCaseInteractor = async ({
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

  const leadCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId: leadCaseId });

  if (!leadCase) {
    throw new NotFoundError(`Lead Case ${leadCaseId} was not found.`);
  }

  const caseEntity = new Case(caseToUpdate, { applicationContext });
  const leadCaseEntity = new Case(leadCase, { applicationContext });

  // if this is a new consolidation we need to
  // set the leadCaseId on the lead case
  if (!leadCaseEntity.leadCaseId) {
    leadCaseEntity.setLeadCase(leadCaseId);

    applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: leadCaseEntity.validate().toRawObject(),
    });
  }

  caseEntity.setLeadCase(leadCaseId);

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};
