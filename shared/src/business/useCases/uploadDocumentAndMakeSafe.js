/**
 * uploads a document and then immediately processes it to scan for viruses and validate the document.
 *
 * @param {object} document the documentFile
 * @param {Function} onUploadProgress the progressFunction
 * @returns {Promise<string>} the documentId returned from a successful upload
 */
exports.uploadDocumentAndMakeSafe = async ({
  applicationContext,
  document,
  onUploadProgress,
}) => {
  const documentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocumentFromClient({
      applicationContext,
      document,
      onUploadProgress,
    });

  await applicationContext.getUseCases().virusScanPdfInteractor({
    applicationContext,
    documentId,
  });
  await applicationContext.getUseCases().validatePdfInteractor({
    applicationContext,
    documentId,
  });

  return documentId;
};
