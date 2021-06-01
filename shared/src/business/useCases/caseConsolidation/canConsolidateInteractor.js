const { Case } = require('../../entities/cases/Case');

/**
 * canConsolidateInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseToConsolidate the case to consolidate with
 * @param {object} providers.currentCase the case to check if caseToConsolidate can be consolidated with
 * @returns {object} whether or not the cases can be consolidated with the reason
 */
exports.canConsolidateInteractor = (
  applicationContext,
  { caseToConsolidate, currentCase },
) => {
  const caseEntity = new Case(currentCase, { applicationContext });

  const results = caseEntity.getConsolidationStatus({
    caseEntity: caseToConsolidate,
  });

  return results;
};
