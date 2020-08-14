const { getPdfFromUrl } = require('./getPdfFromUrl');

const getDownloadPolicy = async ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  const {
    data: { url },
  } = await applicationContext
    .getHttpClient()
    .get(
      `${applicationContext.getBaseUrl()}/case-documents/${docketNumber}/${documentId}/download-policy-url`,
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
  docketNumber,
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
      docketNumber,
      documentId,
    });

    return await getPdfFromUrl({ applicationContext, url });
  }
};
