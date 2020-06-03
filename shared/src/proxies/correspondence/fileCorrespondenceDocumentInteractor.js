const { post } = require('../requests');

/**
 * fileCorrespondenceDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.primaryDocumentFileId the id of the correspondence document
 * @returns {Promise<*>} the promise of the api call
 */
exports.fileCorrespondenceDocumentInteractor = ({
  applicationContext,
  documentMetadata,
  primaryDocumentFileId,
}) => {
  const { caseId } = documentMetadata;
  return post({
    applicationContext,
    body: {
      documentMetadata,
      primaryDocumentFileId,
    },
    endpoint: `/case-documents/${caseId}/correspondence`,
  });
};
