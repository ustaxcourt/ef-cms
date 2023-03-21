const { put } = require('../requests');

/**
 * updateCorrespondenceDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.correspondenceId the id of the correspondence document
 * @param {object} providers.documentMetadata the document metadata
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCorrespondenceDocumentInteractor = (
  applicationContext,
  { correspondenceId, documentMetadata },
) => {
  const { docketNumber } = documentMetadata;

  return put({
    applicationContext,
    body: {
      documentMetadata,
    },
    endpoint: `/case-documents/${docketNumber}/correspondence/${correspondenceId}`,
  });
};
