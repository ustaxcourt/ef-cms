const getUploadPolicy = async ({ applicationContext, documentId }) => {
  const response = await applicationContext
    .getHttpClient()
    .get(
      `${applicationContext.getBaseUrl()}/documents/${documentId}/upload-policy`,
      {
        headers: {
          Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
        },
      },
    );
  return response.data;
};

exports.uploadDocument = async ({
  applicationContext,
  document,
  documentId,
  onUploadProgress,
}) => {
  const docId = documentId || applicationContext.getUniqueId();
  const policy = await getUploadPolicy({
    applicationContext,
    documentId: docId,
  });
  await applicationContext.getPersistenceGateway().uploadPdf({
    applicationContext,
    documentId: docId,
    file: document,
    onUploadProgress,
    policy,
  });
  return docId;
};
