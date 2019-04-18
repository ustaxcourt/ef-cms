const { post } = require('../requests');

/**
 * fileExternalDocumentProxy
 *
 * @param documents
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.fileExternalDocument = ({
  documentMetadata,
  primaryDocumentFileId,
  secondaryDocumentFileId,
  secondarySupportingDocumentFileId,
  supportingDocumentFileId,
  applicationContext,
}) => {
  const { caseId } = documentMetadata;
  return post({
    applicationContext,
    body: {
      documentMetadata,
      primaryDocumentFileId,
      secondaryDocumentFileId,
      secondarySupportingDocumentFileId,
      supportingDocumentFileId,
    },
    endpoint: `/cases/${caseId}/external-document`,
  });
};
