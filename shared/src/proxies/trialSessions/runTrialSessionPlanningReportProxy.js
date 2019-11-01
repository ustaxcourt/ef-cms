const { get } = require('../requests');

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
  return get({
    applicationContext,
    endpoint: `/trial-sessions/planning-report?term=${term}&year=${year}`,
  });
};
