const getUploadPolicy = async ({ applicationContext }) => {
  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/api/documents/upload-policy`, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    });
  return response.data;
};

exports.uploadDocument = async ({
  applicationContext,
  document,
  onUploadProgress,
}) => {
  const policy = await getUploadPolicy({ applicationContext });
  const documentId = await applicationContext
    .getPersistenceGateway()
    .uploadPdf({
      applicationContext,
      file: document,
      onUploadProgress,
      policy,
    });

  return documentId;
};
