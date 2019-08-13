const getUploadPolicy = async ({ applicationContext }) => {
  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/documents/upload-policy`, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    });
  return response.data;
};

exports.uploadDocument = async ({
  applicationContext,
  document,
  documentId,
  onUploadProgress,
}) => {
  const policy = await getUploadPolicy({ applicationContext });
  const docId = await applicationContext.getPersistenceGateway().uploadPdf({
    applicationContext,
    documentId,
    file: document,
    onUploadProgress,
    policy,
  });

  return docId;
};
