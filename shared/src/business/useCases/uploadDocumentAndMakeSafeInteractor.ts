export const uploadDocumentAndMakeSafeInteractor = async (
  applicationContext: any, // keep as any until the UI is refactored
  {
    document,
    key,
    onUploadProgress,
  }: {
    document: any;
    key?: string;
    onUploadProgress: (progressEvent: any) => void;
  },
): Promise<string> => {
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
