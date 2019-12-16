/**
 * getConsolidatedCasesByCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId id of the case to get associated cases for
 * @returns {Array<object>} the cases the user is associated with
 */
exports.getConsolidatedCasesByCaseInteractor = async ({
  applicationContext,
  caseId,
}) => {
  return await applicationContext.getPersistenceGateway().getCasesByLeadCaseId({
    applicationContext,
    leadCaseId: caseId,
  });
};
