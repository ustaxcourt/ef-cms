const { post } = require('../requests');

/**
 * runTrialSessionPlanningReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.term the term
 * @param {object} providers.year the year
 * @returns {Promise<*>} the promise of the api call
 */
exports.runTrialSessionPlanningReportInteractor = (
  applicationContext,
  { term, year },
) => {
  return post({
    applicationContext,
    body: {
      term,
      year,
    },
    endpoint: '/reports/planning-report',
  });
};
