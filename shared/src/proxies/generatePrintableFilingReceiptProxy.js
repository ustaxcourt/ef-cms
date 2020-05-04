const { post } = require('./requests');

/**
 * generatePrintableFilingReceiptInteractor (proxy)
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case in which the documents were filed
 * @param {object} providers.documentsFiled the documents filed
 * @returns {Promise<*>} the promise of the api call
 */
exports.generatePrintableFilingReceiptInteractor = ({
  applicationContext,
  caseId,
  documentsFiled,
}) => {
  return post({
    applicationContext,
    body: {
      caseId,
      documentsFiled,
    },
    endpoint: '/documents/filing-receipt-pdf',
  });
};
