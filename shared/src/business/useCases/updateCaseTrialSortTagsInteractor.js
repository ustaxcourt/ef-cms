const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

/**
 * updates the case trial sort tags
 *
 * @param applicationContext
 * @param caseId
 * @returns {Promise<*>}
 */
exports.updateCaseTrialSortTagsInteractor = async ({
  applicationContext,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  const caseEntity = new Case(caseToUpdate);

  if (!isAuthorized(user, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  if (caseEntity.status === Case.STATUS_TYPES.generalDocketReadyForTrial) {
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
