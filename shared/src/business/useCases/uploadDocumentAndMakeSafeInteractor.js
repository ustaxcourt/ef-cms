/**
 * uploads a document and then immediately processes it to scan for viruses and validate the document.
 *
 * @param {object} document the documentFile
 * @param {Function} onUploadProgress the progressFunction
 * @returns {Promise<string>} the key returned from a successful upload
 */
exports.uploadDocumentAndMakeSafeInteractor = async (
  applicationContext,
  { document, key, onUploadProgress },
) => {
  const uploadedKey = await applicationContext
    .getPersistenceGateway()
    .uploadDocumentFromClient({
      applicationContext,
      document,
      key,
      onUploadProgress,
    });

  await applicationContext
    .getUseCases()
    .getStatusOfVirusScanInteractor(applicationContext, {
      key: uploadedKey,
    });
  await applicationContext
    .getUseCases()
    .validatePdfInteractor(applicationContext, {
      key: uploadedKey,
    });

  return uploadedKey;
};
