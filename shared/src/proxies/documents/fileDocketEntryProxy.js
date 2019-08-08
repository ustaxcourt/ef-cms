const { post } = require('../requests');

/**
 * fileDocketEntryProxy
 *
 * @param documents
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.fileDocketEntryInteractor = ({
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
    endpoint: `/cases/${caseId}/docket-entry`,
  });
};
