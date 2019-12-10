const { post } = require('./requests');

/**
 * serveCourtIssuedDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 * @param {object} providers.documentId the id of the document
 * @returns {Promise<*>} the promise of the api call
 */
exports.serveCourtIssuedDocumentInteractor = ({
  applicationContext,
  caseId,
  documentId,
}) => {
  return post({
    applicationContext,
    body: {},
    endpoint: `/case-documents/${caseId}/${documentId}/serve-court-issued`,
    headers: {
      Accept: 'application/pdf',
    },
    options: { responseType: 'blob' },
  });
};
