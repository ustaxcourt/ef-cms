const { Case } = require('../../entities/cases/Case');

/**
 * Retrieves all cases associated with the provided leadDocketNumber.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.leadDocketNumber the leadDocketNumber
 * @returns {object} a list of all cases associated with the leadDocketNumber
 */
exports.getConsolidatedCasesForLeadCase = async ({
  applicationContext,
  leadDocketNumber,
}) => {
  let consolidatedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber,
    });

  consolidatedCases = Case.validateRawCollection(consolidatedCases, {
    applicationContext,
    filtered: true,
  });

  return consolidatedCases;
};
