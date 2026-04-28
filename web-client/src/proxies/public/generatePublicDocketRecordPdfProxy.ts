import { post } from '../requests';

/**
 * generatePublicDocketRecordPdfInteractor (proxy)
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the case docket number
 * @returns {Promise<*>} the promise of the api call
 */
export const generatePublicDocketRecordPdfInteractor = (
  applicationContext,
  {
    docketNumber,
    docketRecordTableSort,
  }: {
    docketNumber: string;
    docketRecordTableSort: {
      sortField: string;
      sortOrder: string;
    };
  },
) => {
  return post({
    applicationContext,
    body: {
      docketNumber,
      docketRecordTableSort,
    },
    endpoint: `/public-api/cases/${docketNumber}/generate-docket-record`,
  });
};
