const { post } = require('./requests');

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
  return post({
    applicationContext,
    body: {
      htmlString,
    },
    endpoint: '/court-issued-order',
  });
};
