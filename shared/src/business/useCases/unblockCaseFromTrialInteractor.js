const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * used for unblocking a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the caseId to unblock
 * @returns {object} the case data
 */
exports.unblockCaseFromTrialInteractor = async ({
  applicationContext,
  caseId,
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

  caseEntity.unsetAsBlocked();

  await applicationContext
    .getPersistenceGateway()
    .createCaseTrialSortMappingRecords({
      applicationContext,
      caseId: caseEntity.caseId,
      caseSortTags: caseEntity.generateTrialSortTags(),
    });

  return await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};
