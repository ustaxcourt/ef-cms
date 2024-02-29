const getUploadPolicy = async ({ applicationContext, key }) => {
  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/documents/${key}/upload-policy`, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    });
  return response.data;
};

export const uploadDocumentFromClient = async ({
  addCoverSheet = false,
  applicationContext,
  document,
  key,
  onUploadProgress = () => {},
}: {
  addCoverSheet: boolean;
  applicationContext;
  document: any;
  key: string;
  onUploadProgress?: () => void;
}) => {
  const docId = key || applicationContext.getUniqueId();
  const policy = await getUploadPolicy({
    applicationContext,
    key: docId,
  });
  await applicationContext.getPersistenceGateway().uploadPdfFromClient({
    addCoverSheet,
    applicationContext,
    file: document,
    key: docId,
    onUploadProgress,
    policy,
  });
  return docId;
};
