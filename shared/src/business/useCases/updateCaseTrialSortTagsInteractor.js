const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

/**
 * updates the case trial sort tags
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update the case trial sort tags
 */
exports.updateCaseTrialSortTagsInteractor = async ({
  applicationContext,
  docketNumber,
}) => {
  const user = applicationContext.getCurrentUser();

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  if (caseEntity.status === CASE_STATUS_TYPES.generalDocketReadyForTrial) {
    const caseSortTags = caseEntity.generateTrialSortTags();

    await applicationContext
      .getPersistenceGateway()
      .updateCaseTrialSortMappingRecords({
        applicationContext,
        caseId: caseEntity.validate().toRawObject().caseId,
        caseSortTags,
      });
  }
};
