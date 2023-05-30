import { post } from './requests';

/**
 * generateDocketRecordPdfInteractor (proxy)
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.contentHtml the html content for the pdf
 * @returns {Promise<*>} the promise of the api call
 */
export const generateDocketRecordPdfInteractor = (
  applicationContext,
  {
    docketNumber,
    docketRecordSort,
    includePartyDetail,
    isIndirectlyAssociated,
  },
) => {
  return post({
    applicationContext,
    body: {
      docketNumber,
      docketRecordSort,
      includePartyDetail,
      isIndirectlyAssociated,
    },
    endpoint: '/api/docket-record-pdf',
  });
};
