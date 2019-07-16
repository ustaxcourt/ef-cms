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
  documentIds,
}) => {
  const { caseId } = documentMetadata;
  return post({
    applicationContext,
    body: {
      documentMetadata,
      documentIds,    
    },
    endpoint: `/cases/${caseId}/external-document`,
  });
};
