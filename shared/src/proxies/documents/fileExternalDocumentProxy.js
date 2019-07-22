const { post } = require('../requests');

/**
 * fileExternalDocumentProxy
 *
 * @param documents
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.fileExternalDocumentInteractor = ({
  applicationContext,
  documentMetadata,
  primaryDocumentFileId,
  secondaryDocumentFileId,
  secondarySupportingDocumentFileId,
  supportingDocumentFileId,
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
