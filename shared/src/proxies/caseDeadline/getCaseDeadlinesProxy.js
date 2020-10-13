const { get } = require('../requests');

/**
 * getCaseDeadlinesInteractorProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.endDate the end date
 * @param {string} providers.startDate the start date
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCaseDeadlinesInteractor = ({
  applicationContext,
  endDate,
  startDate,
}) => {
  return get({
    applicationContext,
    endpoint: `/case-deadlines/${startDate}/${endDate}`,
  });
};
