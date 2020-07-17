const { post } = require('../requests');

/**
 * serveExternallyFiledDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case containing the document to serve
 * @param {string} providers.documentId the id of the document to serve
 * @returns {Promise<*>} the promise of the api call
 */
exports.serveExternallyFiledDocumentInteractor = ({
  applicationContext,
  caseId,
  documentId,
}) => {
  return post({
    applicationContext,
    endpoint: `/case-documents/${caseId}/${documentId}/serve`,
  });
};
