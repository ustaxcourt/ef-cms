const { post } = require('./requests');

/**
 * generatePrintableFilingReceiptInteractor (proxy)
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.documents the documents filed
 * @returns {Promise<*>} the promise of the api call
 */
exports.generatePrintableFilingReceiptInteractor = ({
  applicationContext,
  documents,
}) => {
  return post({
    applicationContext,
    body: {
      documents,
    },
    endpoint: '/documents/filing-receipt-pdf',
  });
};
