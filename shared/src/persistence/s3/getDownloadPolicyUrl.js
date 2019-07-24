/**
 *
 * @param documentId
 * @param applicationContext
 * @returns {Promise<any>}
 */
exports.getDownloadPolicyUrl = ({ applicationContext, documentId }) => {
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
