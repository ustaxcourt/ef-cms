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
  applicationContext,
  document,
  key,
  onUploadProgress = () => {},
}: {
  applicationContext;
  document: any;
  key: string;
  onUploadProgress?: () => void;
}) => {
  const docId = key || applicationContext.getUniqueId();
  console.log('docId', docId);

  const policy = await getUploadPolicy({
    applicationContext,
    key: docId,
  });

  console.log('policy', policy);

  await applicationContext.getPersistenceGateway().uploadPdfFromClient({
    applicationContext,
    file: document,
    key: docId,
    onUploadProgress,
    policy,
  });
  console.log('succesfully uploaded', docId);

  return docId;
};
