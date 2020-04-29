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
  useTempBucket,
}) => {
  // TODO: Fix protocol flag
  if (protocol === 'S3') {
    // TODO: should this be in the persistence gateway?
    const S3 = applicationContext.getStorageClient();
    return (
      await S3.getObject({
        Bucket: useTempBucket
          ? applicationContext.getTempDocumentsBucketName()
          : applicationContext.getDocumentsBucketName(),
        Key: documentId,
      }).promise()
    ).Body;
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
