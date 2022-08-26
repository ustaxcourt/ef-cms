const { CaseDeadline } = require('../../entities/CaseDeadline');

/**
 * getCaseDeadlinesForCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to get case deadlines for
 * @returns {Promise} the promise of the getCaseDeadlines call
 */
exports.getCaseDeadlinesForCaseInteractor = async (
  applicationContext,
  { docketNumber },
) => {
  const caseDeadlines = await applicationContext
    .getPersistenceGateway()
    .getCaseDeadlinesByDocketNumber({
      applicationContext,
      docketNumber,
    });

  return CaseDeadline.validateRawCollection(caseDeadlines, {
    applicationContext,
  });
};
