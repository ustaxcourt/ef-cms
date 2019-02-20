const getUploadPolicy = async ({ applicationContext }) => {
  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/documents/uploadPolicy`, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    });
  return response.data;
};

exports.uploadDocument = async ({ applicationContext, document }) => {
  const policy = await getUploadPolicy({ applicationContext });

  const documentId = await applicationContext
    .getPersistenceGateway()
    .uploadPdf({
      applicationContext,
      policy,
      file: document,
    });

  return documentId;
};
