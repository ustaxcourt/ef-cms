const { post } = require('../requests');

/**
 * runTrialSessionPlanningReportInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.runTrialSessionPlanningReportInteractor = ({
  applicationContext,
  term,
  year,
}) => {
  return post({
    applicationContext,
    body: {
      term,
      year,
    },
    endpoint: '/trial-sessions/planning-report',
    headers: {
      Accept: 'application/pdf',
    },
    options: {
      responseType: 'blob',
    },
  });
};
