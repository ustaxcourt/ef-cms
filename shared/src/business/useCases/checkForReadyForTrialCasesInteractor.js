const { Case } = require('../entities/cases/Case');
const { CASE_STATUS_TYPES } = require('../entities/EntityConstants');
const { createISODateString } = require('../utilities/DateHandler');

/**
 * @param {object} applicationContext the application context
 */
exports.checkForReadyForTrialCasesInteractor = async applicationContext => {
  applicationContext.logger.debug('Time', createISODateString());

  const caseCatalog = await applicationContext
    .getPersistenceGateway()
    .getReadyForTrialCases({ applicationContext });

  const updateForTrial = async entity => {
    // assuming we want these done serially; if first fails, promise is rejected and error thrown
    const caseEntity = entity.validate();
    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

    if (caseEntity.isReadyForTrial()) {
      await applicationContext
        .getPersistenceGateway()
        .createCaseTrialSortMappingRecords({
          applicationContext,
          caseSortTags: caseEntity.generateTrialSortTags(),
          docketNumber: caseEntity.docketNumber,
        });
    }
  };

  const updatedCases = [];

  for (let caseRecord of caseCatalog) {
    const { docketNumber } = caseRecord;
    const caseToCheck = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });

    if (caseToCheck) {
      const caseEntity = new Case(caseToCheck, { applicationContext });

      if (caseEntity.status === CASE_STATUS_TYPES.generalDocket) {
        caseEntity.checkForReadyForTrial();
        if (
          caseEntity.status === CASE_STATUS_TYPES.generalDocketReadyForTrial
        ) {
          updatedCases.push(updateForTrial(caseEntity));
        }
      }
    }
  }

  await Promise.all(updatedCases);

  applicationContext.logger.debug('Time', createISODateString());
};
