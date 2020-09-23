/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.documentId the document id to get
 * @returns {Promise<any>} the promise of the call to the storage client
 */
exports.getDownloadPolicyUrl = ({
  applicationContext,
  documentId,
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
        Key: documentId,
      },
      (err, data) => {
        if (err) {
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
