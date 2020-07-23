const { CASE_STATUS_TYPES } = require('../../entities/EntityConstants');

/**
 * updateCaseAutomaticBlock
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseEntity the case entity to update
 * @returns {object} the updated case entity
 */
exports.updateCaseAutomaticBlock = async ({
  applicationContext,
  caseEntity,
}) => {
  if (!caseEntity.trialDate) {
    const caseDeadlines = await applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
      });

    caseEntity.updateAutomaticBlocked({ caseDeadlines });

    if (caseEntity.automaticBlocked) {
      await applicationContext
        .getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords({
          applicationContext,
          caseId: caseEntity.caseId,
        });
    } else if (
      caseEntity.status === CASE_STATUS_TYPES.generalDocketReadyForTrial &&
      !caseEntity.blocked
    ) {
      await applicationContext
        .getPersistenceGateway()
        .createCaseTrialSortMappingRecords({
          applicationContext,
          caseId: caseEntity.caseId,
          caseSortTags: caseEntity.generateTrialSortTags(),
        });
    }
  }

  return caseEntity;
};
