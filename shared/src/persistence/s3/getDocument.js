const getDownloadPolicy = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  const {
    data: { url },
  } = await applicationContext
    .getHttpClient()
    .get(
      `${applicationContext.getBaseUrl()}/case-documents/${caseId}/${documentId}/download-policy-url`,
      {
        headers: {
          Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
        },
      },
    );
  return url;
};

exports.getDocument = async ({
  applicationContext,
  caseId,
  documentId,
  protocol,
}) => {
  // TODO: Fix protocol flag
  if (protocol === 'S3') {
    // TODO: should this be in the persistence gateway?
    const S3 = applicationContext.getStorageClient();
    return S3.getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
    });
  } else {
    const url = await getDownloadPolicy({
      applicationContext,
      caseId,
      documentId,
    });
    const { data: fileBlob } = await applicationContext.getHttpClient()({
      method: 'GET',
      responseType: 'blob',
      url,
    });
    return new Blob([fileBlob], { type: 'application/pdf' });
  }
};
