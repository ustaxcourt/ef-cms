import { get } from '../requests';

/**
 * getCaseInventoryReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.associatedJudge the optional judge filter
 * @param {number} providers.page the page to retrieve
 * @param {string} providers.status the optional status filter
 * @returns {Promise<*>} the promise of the api call
 */
export const getCaseInventoryReportInteractor = (
  applicationContext,
  { associatedJudge, status },
): Promise<{ foundCases: RawCase[] }> => {
  return get({
    applicationContext,
    endpoint: '/reports/case-inventory-report',
    params: {
      associatedJudge,
      status,
    },
  });
};
