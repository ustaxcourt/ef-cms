import { get } from '../requests';
import qs from 'qs';

/**
 * generatePrintablePendingReportInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the optional docketNumber filter
 * @param {string} providers.judge the optional judge filter
 * @returns {Promise<*>} the promise of the api call
 */
export const generatePrintablePendingReportInteractor = (
  applicationContext,
  { docketNumber, judge },
) => {
  const queryString = qs.stringify({ docketNumber, judge });

  return get({
    applicationContext,
    endpoint: `/reports/pending-report?${queryString}`,
  });
};
