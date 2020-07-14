const { getPdfFromUrl } = require('./getPdfFromUrl');

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
  if (protocol === 'S3') {
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

    return await getPdfFromUrl({ applicationContext, url });
  }
};
