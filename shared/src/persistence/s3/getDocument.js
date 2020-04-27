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
  useTempBucket = false,
}) => {
  // TODO: Fix protocol flag
  if (protocol === 'S3') {
    let Bucket = applicationContext.getDocumentsBucketName();
    if (useTempBucket) {
      Bucket = applicationContext.getTempDocumentsBucketName();
    }

    // TODO: should this be in the persistence gateway?
    const S3 = applicationContext.getStorageClient();
    return (
      await S3.getObject({
        Bucket,
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
