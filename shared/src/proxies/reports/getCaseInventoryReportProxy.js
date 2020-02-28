const querystring = require('querystring');
const { get } = require('../requests');

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
  page = 1,
  status,
}) => {
  const { CASE_INVENTORY_PAGE_SIZE } = applicationContext.getConstants();
  const from = (page - 1) * CASE_INVENTORY_PAGE_SIZE;
  const queryString = querystring.stringify({
    associatedJudge,
    from,
    pageSize: CASE_INVENTORY_PAGE_SIZE,
    status,
  });

  return get({
    applicationContext,
    endpoint: `/reports/case-inventory-report?${queryString}`,
  });
};
