/**
 * getConsolidatedCasesByUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId id of the user to get cases for
 * @returns {Array<object>} the cases the user is associated with
 */
exports.getConsolidatedCasesByUserInteractor = async ({
  applicationContext,
  userId,
}) => {
  let foundCases = [];

  const cases = await applicationContext
    .getPersistenceGateway()
    .getConsolidatedCasesByUser({
      applicationContext,
      userId,
    });

  if (cases && cases.length > 0) {
    const caseMapping = {};
    const caseConsolidationMapping = {};

    cases.forEach(caseRecord => {
      const { caseId, leadCaseId } = caseRecord;

      if (leadCaseId) {
        if (leadCaseId === caseId) {
          caseMapping[caseId] = caseRecord;
        } else {
          if (!caseConsolidationMapping.hasOwnProperty(leadCaseId)) {
            caseConsolidationMapping[leadCaseId] = [];
          }
          caseConsolidationMapping[leadCaseId].push(caseRecord);
        }
      }
    });

    Object.keys(caseConsolidationMapping).forEach(leadCaseId => {
      caseMapping[leadCaseId].consolidatedCases =
        caseConsolidationMapping[leadCaseId];
    });

    foundCases = Object.keys(caseMapping).map(caseId => caseMapping[caseId]);
    // TODO: Do we want to re-sort these?
  }

  return foundCases;
};
