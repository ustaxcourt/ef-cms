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
  transaction,
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
        transaction,
      });
  } else if (caseEntity.isReadyForTrial()) {
    await applicationContext
      .getPersistenceGateway()
      .createCaseTrialSortMappingRecords({
        applicationContext,
        caseSortTags: caseEntity.generateTrialSortTags(),
        docketNumber: caseEntity.docketNumber,
        transaction,
      });
  }

  return caseEntity;
};
