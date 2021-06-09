const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * used for removing the high priority from a case
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to unprioritize
 * @returns {object} the case data
 */
exports.unprioritizeCaseInteractor = async (
  applicationContext,
  { docketNumber },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PRIORITIZE_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  let caseEntity = new Case(caseToUpdate, { applicationContext });

  caseEntity.unsetAsHighPriority();

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({ applicationContext, caseEntity });

  if (caseEntity.isReadyForTrial()) {
    await applicationContext
      .getPersistenceGateway()
      .createCaseTrialSortMappingRecords({
        applicationContext,
        caseSortTags: caseEntity.generateTrialSortTags(),
        docketNumber: caseEntity.docketNumber,
      });
  } else {
    await applicationContext
      .getPersistenceGateway()
      .deleteCaseTrialSortMappingRecords({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
      });
  }

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
