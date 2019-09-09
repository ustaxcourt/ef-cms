const { post } = require('../requests');

/**
 * signDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case on which to save the document
 * @param {string} providers.originalDocumentId the id of the original (unsigned) document
 * @param {string} providers.signedDocumentId the id of the signed document
 * @returns {Promise<*>} the promise of the api call
 */
exports.signDocumentInteractor = ({
  applicationContext,
  caseId,
  originalDocumentId,
  signedDocumentId,
}) => {
  return post({
    applicationContext,
    body: {
      signedDocumentId,
    },
    endpoint: `/case-documents/${caseId}/documents/${originalDocumentId}/sign`,
  });
};
