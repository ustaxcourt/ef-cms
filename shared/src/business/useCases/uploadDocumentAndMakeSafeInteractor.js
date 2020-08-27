/**
 * uploads a document and then immediately processes it to scan for viruses and validate the document.
 *
 * @param {object} document the documentFile
 * @param {Function} onUploadProgress the progressFunction
 * @returns {Promise<string>} the documentId returned from a successful upload
 */
exports.uploadDocumentAndMakeSafeInteractor = async ({
  applicationContext,
  document,
  documentId,
  onUploadProgress,
}) => {
  const uploadedDocumentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocumentFromClient({
      applicationContext,
      document,
      documentId,
      onUploadProgress,
    });

  await applicationContext.getUseCases().virusScanPdfInteractor({
    applicationContext,
    documentId: uploadedDocumentId,
  });
  await applicationContext.getUseCases().validatePdfInteractor({
    applicationContext,
    documentId: uploadedDocumentId,
  });

  return uploadedDocumentId;
};
