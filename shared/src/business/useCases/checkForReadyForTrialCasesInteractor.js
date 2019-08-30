const { Case } = require('../entities/cases/Case');
const { createISODateString } = require('../utilities/DateHandler');

/**
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 */
exports.checkForReadyForTrialCasesInteractor = async ({
  applicationContext,
}) => {
  applicationContext.logger.info('Time', createISODateString());

  const caseCatalog = await applicationContext
    .getPersistenceGateway()
    .getAllCatalogCases({
      applicationContext,
    });

  const updateForTrial = async entity => {
    // assuming we want these done serially; if first fails, promise is rejected and error thrown
    const caseEntity = entity.validate();
    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.toRawObject(),
    });

    await applicationContext
      .getPersistenceGateway()
      .createCaseTrialSortMappingRecords({
        applicationContext,
        caseId: caseEntity.caseId,
        caseSortTags: caseEntity.generateTrialSortTags(),
      });
  };

  const updatedCases = [];

  for (let caseRecord of caseCatalog) {
    const { caseId } = caseRecord;
    const caseToCheck = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId,
      });

    if (caseToCheck) {
      const caseEntity = new Case({ applicationContext, rawCase: caseToCheck });

      if (caseEntity.status === Case.STATUS_TYPES.generalDocket) {
        caseEntity.checkForReadyForTrial();

        if (
          caseEntity.status === Case.STATUS_TYPES.generalDocketReadyForTrial
        ) {
          updatedCases.push(updateForTrial(caseEntity));
        }
      }
    }
  }
  await Promise.all(updatedCases);

  applicationContext.logger.info('Time', createISODateString());
};
