import { post } from './requests';

/**
 * generatePrintableFilingReceiptInteractor (proxy)
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case in which the documents were filed
 * @param {object} providers.documentsFiled the documents filed
 * @param {boolean} providers.fileAcrossConsolidatedGroup flag to determine whether the document should be filed across the consolidated cases group
 * @returns {Promise<*>} the promise of the api call
 */
export const generatePrintableFilingReceiptInteractor = (
  applicationContext,
  { docketNumber, documentsFiled, fileAcrossConsolidatedGroup },
) => {
  return post({
    applicationContext,
    body: {
      docketNumber,
      documentsFiled,
      fileAcrossConsolidatedGroup,
    },
    endpoint: '/documents/filing-receipt-pdf',
  });
};
