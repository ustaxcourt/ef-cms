const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');
/**
 * used for setting a case as blocked
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.reason the reason the case is being blocked
 * @param {string} providers.caseId the caseId to block
 * @returns {object} the case data
 */
exports.blockCaseFromTrialInteractor = async ({
  applicationContext,
  caseId,
  reason,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.BLOCK_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  caseEntity.setAsBlocked(reason);

  await applicationContext
    .getPersistenceGateway()
    .deleteCaseTrialSortMappingRecords({
      applicationContext,
      caseId,
    });

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};
