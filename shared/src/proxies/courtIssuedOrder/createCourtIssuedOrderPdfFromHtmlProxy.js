const { post } = require('../requests');

/**
 * createCourtIssuedOrderPdfFromHtml
 *
 * @param htmlString
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createCourtIssuedOrderPdfFromHtml = ({
  applicationContext,
  htmlString,
}) => {
  return applicationContext
    .getHttpClient()
    .post(
      `${applicationContext.getBaseUrl()}/court-issued-order`,
      {
        htmlString,
      },
      {
        headers: {
          Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
        },
        responseType: 'blob',
      },
    )
    .then(response => window.URL.createObjectURL(new Blob([response.data])));
};
