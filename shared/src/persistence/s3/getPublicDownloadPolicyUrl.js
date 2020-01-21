/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.documentId the document id to get
 * @returns {Promise<any>} the promise of the call to the storage client
 */
exports.getPublicDownloadPolicyUrl = ({ applicationContext, documentId }) => {
  return new Promise((resolve, reject) => {
    applicationContext.getStorageClient().getSignedUrl(
      'getObject',
      {
        Bucket: applicationContext.getDocumentsBucketName(),
        Expires: 120,
        Key: documentId,
      },
      (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve({
          url: data,
        });
      },
    );
  });
};
