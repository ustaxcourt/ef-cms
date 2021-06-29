const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * used for setting a case as high priority
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.reason the reason the case is being set as high priority
 * @param {string} providers.docketNumber the docket number of the case to set as high priority
 * @returns {object} the case data
 */
exports.prioritizeCaseInteractor = async (
  applicationContext,
  { docketNumber, reason },
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

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (caseEntity.isCalendared()) {
    throw new Error('Cannot set a calendared case as high priority');
  }
  if (caseEntity.blocked === true) {
    throw new Error('Cannot set a blocked case as high priority');
  }

  caseEntity.setAsHighPriority(reason);

  if (caseEntity.preferredTrialCity && !caseEntity.blocked) {
    await applicationContext
      .getPersistenceGateway()
      .createCaseTrialSortMappingRecords({
        applicationContext,
        caseSortTags: caseEntity.generateTrialSortTags(),
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
