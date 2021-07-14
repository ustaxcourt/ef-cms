const { post } = require('../requests');

/**
 * fileCourtIssuedOrderProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.primaryDocumentFileId the id of the primary document
 * @returns {Promise<*>} the promise of the api call
 */
exports.fileCourtIssuedOrderInteractor = (
  applicationContext,
  { documentMetadata, primaryDocumentFileId },
) => {
  const { docketNumber } = documentMetadata;
  return post({
    applicationContext,
    body: {
      documentMetadata,
      primaryDocumentFileId,
    },
    endpoint: `/case-documents/${docketNumber}/court-issued-order`,
  });
};
