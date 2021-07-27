const { post } = require('../requests');

/**
 * addPaperFilingProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @param {Boolean} providers.generateCoversheet true if coversheet must be generated
 * @param {Boolean} providers.isSavingForLater true if saving for later, false otherwise
 * @param {string} providers.primaryDocumentFileId the id of the primary document file
 * @returns {Promise<*>} the promise of the api call
 */
exports.addPaperFilingInteractor = (
  applicationContext,
  {
    documentMetadata,
    generateCoversheet,
    isSavingForLater,
    primaryDocumentFileId,
  },
) => {
  const { docketNumber } = documentMetadata;
  return post({
    applicationContext,
    body: {
      documentMetadata,
      generateCoversheet,
      isSavingForLater,
      primaryDocumentFileId,
    },
    endpoint: `/case-documents/${docketNumber}/paper-filing`,
  });
};
