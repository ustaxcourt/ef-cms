const { post } = require('../requests');

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
  return post({
    applicationContext,
    body: {
      docketNumberWithSuffix,
      htmlString,
    },
    endpoint: '/api/court-issued-order',
    headers: {
      Accept: 'application/pdf',
    },
    options: {
      responseType: 'blob',
    },
  });
};
