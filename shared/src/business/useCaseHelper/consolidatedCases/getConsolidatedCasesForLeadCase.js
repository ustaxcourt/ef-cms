const { Case } = require('../../entities/cases/Case');

/**
 * Retrieves all cases associated with the provided leadCaseId.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.leadCaseId the leadCaseId
 * @returns {object} a list of all cases associated with the leadCaseId
 */
exports.getConsolidatedCasesForLeadCase = async ({
  applicationContext,
  leadCaseId,
}) => {
  let consolidatedCases = await applicationContext
    .getPersistenceGateway()
    .getCasesByLeadCaseId({
      applicationContext,
      leadCaseId,
    });

  consolidatedCases = Case.validateRawCollection(consolidatedCases, {
    applicationContext,
    filtered: true,
  });

  return consolidatedCases;
};
