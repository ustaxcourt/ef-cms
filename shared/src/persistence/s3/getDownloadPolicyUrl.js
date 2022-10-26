/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.key the key of the document to get
 * @returns {Promise<any>} the promise of the call to the storage client
 */
exports.getDownloadPolicyUrl = ({
  applicationContext,
  filename,
  key,
  useTempBucket,
}) => {
  const bucketName = useTempBucket
    ? applicationContext.getTempDocumentsBucketName()
    : applicationContext.getDocumentsBucketName();

  return new Promise((resolve, reject) => {
    applicationContext.getStorageClient().getSignedUrl(
      'getObject',
      {
        Bucket: bucketName,
        Expires: 120,
        Key: key,
        ResponseContentDisposition: filename
          ? `inline; attachment; filename="${filename}"`
          : undefined,
      },
      (err, data) => {
        if (err) {
          applicationContext.logger.error(
            'could not create a download policy url',
            err,
          );
          return reject(new Error(err));
        }
        resolve({
          url: applicationContext.documentUrlTranslator({
            applicationContext,
            documentUrl: data,
            useTempBucket,
          }),
        });
      },
    );
  });
};
