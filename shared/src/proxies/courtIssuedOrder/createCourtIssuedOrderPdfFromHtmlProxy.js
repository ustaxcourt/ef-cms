/**
 * createCourtIssuedOrderPdfFromHtml
 *
 * @param applicationContext
 * @param htmlString
 * @returns {Promise<*>}
 */
exports.createCourtIssuedOrderPdfFromHtml = ({
  applicationContext,
  docketNumberWithSuffix,
  htmlString,
}) => {
  return applicationContext
    .getHttpClient()
    .post(
      `${applicationContext.getBaseUrl()}/court-issued-order`,
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
