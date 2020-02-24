const querystring = require('querystring');
const { get } = require('./requests');

/**
 * getCaseInventoryReportInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.associatedJudge the judge to filter by
 * @param {string} providers.status the status to filter by
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCaseInventoryReportInteractor = ({
  applicationContext,
  associatedJudge,
  status,
}) => {
  const queryString = querystring.stringify({ associatedJudge, status });

  return get({
    applicationContext,
    endpoint: `/case-inventory-report?${queryString}`,
  });
};
