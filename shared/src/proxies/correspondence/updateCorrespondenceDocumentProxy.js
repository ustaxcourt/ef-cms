const { put } = require('../requests');

/**
 * updateCorrespondenceDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.documentIdToEdit the id of the correspondence document
 * @param {object} providers.documentMetadata the document metadata
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCorrespondenceDocumentInteractor = ({
  applicationContext,
  documentIdToEdit,
  documentMetadata,
}) => {
  const { caseId } = documentMetadata;
  return put({
    applicationContext,
    body: {
      documentMetadata,
    },
    endpoint: `/case-documents/${caseId}/correspondence/${documentIdToEdit}`,
  });
};
