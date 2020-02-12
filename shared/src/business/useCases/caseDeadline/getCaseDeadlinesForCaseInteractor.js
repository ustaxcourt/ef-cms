const { CaseDeadline } = require('../../entities/CaseDeadline');

/**
 * getCaseDeadlinesForCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to get case deadlines for
 * @returns {Promise} the promise of the getCaseDeadlines call
 */
exports.getCaseDeadlinesForCaseInteractor = async ({
  applicationContext,
  caseId,
}) => {
  const caseDeadlines = await applicationContext
    .getPersistenceGateway()
    .getCaseDeadlinesByCaseId({
      applicationContext,
      caseId,
    });

  return CaseDeadline.validateRawCollection(caseDeadlines, {
    applicationContext,
  });
};
