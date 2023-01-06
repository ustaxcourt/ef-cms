const { put } = require('../requests');

/**
 * editPaperFilingProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @param {Boolean} providers.isSavingForLater true if saving for later, false otherwise
 * @param {string} providers.primaryDocumentFileId the id of the primary document file
 * @returns {Promise<*>} the promise of the api call
 */
exports.editPaperFilingInteractor = (
  applicationContext,
  { docketEntryId, documentMetadata, isSavingForLater },
) => {
  const { docketNumber } = documentMetadata;
  return put({
    applicationContext,
    body: {
      docketEntryId,
      documentMetadata,
      isSavingForLater,
    },
    endpoint: `/case-documents/${docketNumber}/paper-filing`,
  });
};
