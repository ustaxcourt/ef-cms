const { post } = require('../requests');

/**
 * createCourtIssuedOrderPdfFromHtmlInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id where the order is generated
 * @param {string} providers.contentHtml the html string for the pdf content
 * @param {string} providers.documentTitle the title of the document
 * @param {string} providers.signatureText (optional) text to be used as the signatory of the document
 * @returns {Promise<*>} the promise of the api call
 */
exports.createCourtIssuedOrderPdfFromHtmlInteractor = ({
  applicationContext,
  caseId,
  contentHtml,
  documentTitle,
  signatureText,
}) => {
  return post({
    applicationContext,
    body: {
      caseId,
      contentHtml,
      documentTitle,
      signatureText,
    },
    endpoint: '/api/court-issued-order',
  });
};
