/**
 * createCourtIssuedOrderPdfFromHtmlInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumberWithSuffix the docket number of the case with the suffix
 * @param {string} providers.htmlString the htmlString for the pdf content
 * @returns {Promise<*>} the promise of the api call
 */
exports.createCourtIssuedOrderPdfFromHtmlInteractor = ({
  applicationContext,
  docketNumberWithSuffix,
  htmlString,
}) => {
  return applicationContext
    .getHttpClient()
    .post(
      `${applicationContext.getBaseUrl()}/api/court-issued-order`,
      {
        docketNumberWithSuffix,
        htmlString,
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
