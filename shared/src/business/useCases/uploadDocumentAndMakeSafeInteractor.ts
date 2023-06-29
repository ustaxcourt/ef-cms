/**
 * uploads a document and then immediately processes it to scan for viruses and validate the document.
 *
 * @param {object} document the documentFile
 * @param {Function} onUploadProgress the progressFunction
 * @returns {Promise<string>} the key returned from a successful upload
 */
export const uploadDocumentAndMakeSafeInteractor = async (
  applicationContext: any, // keep as any until the UI is refactored
  {
    document,
    key,
    onUploadProgress,
  }: { document: any; key: string; onUploadProgress: () => void },
) => {
  console.log('IN uploadDocumentAndMakeSafeInteractor******');

  const uploadedKey = await applicationContext
    .getPersistenceGateway()
    .uploadDocumentFromClient({
      applicationContext,
      document,
      key,
      onUploadProgress,
    });

  console.log('UPLOAD LINK******', uploadedKey);

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
