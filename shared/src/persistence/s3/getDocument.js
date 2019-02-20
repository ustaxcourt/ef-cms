const getDownloadPolicy = async ({ applicationContext, documentId }) => {
  const {
    data: { url },
  } = await applicationContext
    .getHttpClient()
    .get(
      `${applicationContext.getBaseUrl()}/documents/${documentId}/downloadPolicyUrl`,
      {
        headers: {
          Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
        },
      },
    );
  return url;
};

exports.getDocument = async ({ applicationContext, documentId }) => {
  const url = await getDownloadPolicy({ applicationContext, documentId });
  const { data: fileBlob } = await applicationContext.getHttpClient()({
    url,
    method: 'GET',
    responseType: 'blob',
  });
  return new Blob([fileBlob], { type: 'application/pdf' });
};
