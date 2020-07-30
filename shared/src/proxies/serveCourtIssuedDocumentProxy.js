const { post } = require('./requests');

/**
 * serveCourtIssuedDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @param {object} providers.documentId the id of the document
 * @returns {Promise<*>} the promise of the api call
 */
exports.serveCourtIssuedDocumentInteractor = ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  return post({
    applicationContext,
    body: {},
    endpoint: `/case-documents/${docketNumber}/${documentId}/serve-court-issued`,
  });
};
