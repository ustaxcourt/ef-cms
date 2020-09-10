/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.key the key of the document to get
 * @returns {Promise<any>} the promise of the call to the storage client
 */
exports.getDownloadPolicyUrl = ({ applicationContext, key, useTempBucket }) => {
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
