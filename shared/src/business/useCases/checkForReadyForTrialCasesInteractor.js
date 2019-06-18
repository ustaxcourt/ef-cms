const { Case, STATUS_TYPES } = require('../entities/Case');

/**
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.checkForReadyForTrialCases = async ({ applicationContext }) => {
  applicationContext.logger.info('Time', new Date().toISOString());

  const caseCatalog = await applicationContext
    .getPersistenceGateway()
    .getAllCatalogCases({
      applicationContext,
    });

  for (let caseRecord of caseCatalog) {
    const caseId = caseRecord.caseId;
    const caseToCheck = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId,
      });

    if (caseToCheck) {
      const caseEntity = new Case(caseToCheck);

      if (caseEntity.status === STATUS_TYPES.generalDocket) {
        caseEntity.checkForReadyForTrial();

        if (caseEntity.status === STATUS_TYPES.generalDocketReadyForTrial) {
          await applicationContext.getPersistenceGateway().updateCase({
            applicationContext,
            caseToUpdate: caseEntity.validate().toRawObject(),
          });

          await applicationContext
            .getPersistenceGateway()
            .createCaseTrialSortMappingRecords({
              applicationContext,
              caseId,
              caseSortTags: caseEntity.validate().generateTrialSortTags(),
            });
        }
      }
    }
  }

  applicationContext.logger.info('Time', new Date().toISOString());
};
