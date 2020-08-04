const { Case } = require('../entities/cases/Case');

/**
 * getConsolidatedCasesByCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber docket number of the case to get associated cases for
 * @returns {Array<object>} the cases the user is associated with
 */
exports.getConsolidatedCasesByCaseInteractor = async ({
  applicationContext,
  docketNumber,
}) => {
  const consolidatedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber: docketNumber,
    });

  return Case.validateRawCollection(consolidatedCases, { applicationContext });
};
