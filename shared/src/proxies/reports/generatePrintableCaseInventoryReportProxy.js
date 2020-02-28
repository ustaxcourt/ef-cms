const querystring = require('querystring');
const { get } = require('../requests');

/**
 * generatePrintableCaseInventoryReportInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.associatedJudge the judge to filter by
 * @param {string} providers.status the status to filter by
 * @returns {Promise<*>} the promise of the api call
 */
exports.generatePrintableCaseInventoryReportInteractor = ({
  applicationContext,
  associatedJudge,
  status,
}) => {
  const queryString = querystring.stringify({ associatedJudge, status });

  return get({
    applicationContext,
    endpoint: `/reports/printable-case-inventory-report?${queryString}`,
  });
};
