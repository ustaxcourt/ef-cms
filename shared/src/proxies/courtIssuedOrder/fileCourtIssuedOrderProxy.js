const { post } = require('../requests');

/**
 * fileCourtIssuedOrderProxy
 *
 * @param documents
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.fileCourtIssuedOrderInteractor = ({
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
    endpoint: `/cases/${caseId}/court-issued-order`,
  });
};
