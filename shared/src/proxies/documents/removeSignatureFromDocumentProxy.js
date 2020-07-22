const { post } = require('../requests');

/**
 * removeSignatureFromDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case containing the document to remove signature from
 * @param {string} providers.documentId the id of the signed document
 * @returns {Promise<*>} the promise of the api call
 */
exports.removeSignatureFromDocumentInteractor = ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  return post({
    applicationContext,
    endpoint: `/case-documents/${docketNumber}/${documentId}/remove-signature`,
  });
};
