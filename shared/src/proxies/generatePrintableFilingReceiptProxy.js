const { post } = require('./requests');

/**
 * generatePrintableFilingReceiptInteractor (proxy)
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case in which the documents were filed
 * @param {object} providers.documentsFiled the documents filed
 * @returns {Promise<*>} the promise of the api call
 */
exports.generatePrintableFilingReceiptInteractor = (
  applicationContext,
  { docketNumber, documentsFiled },
) => {
  return post({
    applicationContext,
    body: {
      docketNumber,
      documentsFiled,
    },
    endpoint: '/documents/filing-receipt-pdf',
  });
};
