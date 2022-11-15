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
  removingAutomaticBlock,
}) => {
  if (
    (caseEntity.trialDate && !removingAutomaticBlock) ||
    caseEntity.highPriority
  ) {
    return caseEntity;
  }
  const caseDeadlines = await applicationContext
    .getPersistenceGateway()
    .getCaseDeadlinesByDocketNumber({
      applicationContext,
      docketNumber: caseEntity.docketNumber,
    });

  caseEntity.updateAutomaticBlocked({ caseDeadlines });

  await updateCaseTrialSortMappingRecords({
    applicationContext,
    caseEntity,
  });

  return caseEntity;
};

const updateCaseTrialSortMappingRecords = async ({
  applicationContext,
  caseEntity,
}) => {
  if (caseEntity.automaticBlocked) {
    await applicationContext
      .getPersistenceGateway()
      .deleteCaseTrialSortMappingRecords({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
      });
  } else if (caseEntity.isReadyForTrial() && !caseEntity.trialDate) {
    await applicationContext
      .getPersistenceGateway()
      .createCaseTrialSortMappingRecords({
        applicationContext,
        caseSortTags: caseEntity.generateTrialSortTags(),
        docketNumber: caseEntity.docketNumber,
      });
  }
};
