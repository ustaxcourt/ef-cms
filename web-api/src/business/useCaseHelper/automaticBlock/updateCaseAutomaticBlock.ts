/**
 * updateCaseAutomaticBlock
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseEntity the case entity to update
 * @returns {object} the updated case entity
 */
export const updateCaseAutomaticBlock = async ({
  applicationContext,
  caseEntity,
}) => {
  if (caseEntity.trialDate || caseEntity.highPriority) {
    return caseEntity;
  }
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
        docketNumber: caseEntity.docketNumber,
      });
  } else if (caseEntity.isReadyForTrial()) {
    await applicationContext
      .getPersistenceGateway()
      .createCaseTrialSortMappingRecords({
        applicationContext,
        caseSortTags: caseEntity.generateTrialSortTags(),
        docketNumber: caseEntity.docketNumber,
      });
  }

  return caseEntity;
};
