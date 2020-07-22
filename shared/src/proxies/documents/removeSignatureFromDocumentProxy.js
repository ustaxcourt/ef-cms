const { post } = require('../requests');

/**
 * removeSignatureFromDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case containing the document to remove signature from
 * @param {string} providers.documentId the id of the signed document
 * @returns {Promise<*>} the promise of the api call
 */
exports.removeSignatureFromDocumentInteractor = ({
  applicationContext,
  caseId,
  documentId,
}) => {
  return post({
    applicationContext,
    endpoint: `/case-documents/${caseId}/${documentId}/remove-signature`,
  });
};
