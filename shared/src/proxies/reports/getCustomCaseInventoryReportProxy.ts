import { GetCaseInventoryReportRequest } from '../../business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { get } from '../requests';

/**
 * getCaseInventoryReportInteractor
 * @param {object} applicationContext the application context
 * @param {object} filters the object containing the filters
 * @param {string} providers.caseStatuses the optional caseStatuses filter
 * @param {number} providers.caseTypes the optional caseTypes filter
 * @param {string} providers.endDate the endDate filter
 * @param {string} providers.startDate the startDate filter
 * @param {string} providers.filingMethod the optional filingMethod filter
 * @returns {Promise<*>} the promise of the api call
 */
export const getCustomCaseInventoryReportInteractor = (
  applicationContext,
  filters: GetCaseInventoryReportRequest,
) => {
  return get({
    applicationContext,
    endpoint: '/reports/custom-case-inventory-report',
    params: filters,
  });
};
