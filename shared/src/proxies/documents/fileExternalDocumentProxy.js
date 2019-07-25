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
  documentIds,
  documentMetadata,
}) => {
  const { caseId } = documentMetadata;
  return post({
    applicationContext,
    body: {
      documentIds,
      documentMetadata,
    },
    endpoint: `/cases/${caseId}/external-document`,
  });
};
