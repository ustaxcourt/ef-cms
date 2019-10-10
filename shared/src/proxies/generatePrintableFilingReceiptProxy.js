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
  return applicationContext
    .getHttpClient()
    .post(
      `${applicationContext.getBaseUrl()}/documents/filing-receipt-pdf`,
      {
        documents,
      },
      {
        headers: {
          Accept: 'application/pdf',
          Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
        },
        responseType: 'blob',
      },
    )
    .then(response => new Blob([response.data], { type: 'application/pdf' }));
};
