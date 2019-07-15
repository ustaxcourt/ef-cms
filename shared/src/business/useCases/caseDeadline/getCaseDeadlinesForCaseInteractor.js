/**
 * getCaseDeadlinesForCaseInteractor
 *
 * @param applicationContext
 * @param caseId
 * @returns {*}
 */
exports.getCaseDeadlinesForCaseInteractor = async ({
  applicationContext,
  caseId,
}) => {
  return await applicationContext
    .getPersistenceGateway()
    .getCaseDeadlinesByCaseId({
      applicationContext,
      caseId,
    });
};
