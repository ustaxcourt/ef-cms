/**
 * getDownloadPolicyUrl
 * @param documentId
 * @param applicationContext
 * @returns {Promise<any>}
 */
exports.getDownloadPolicyUrl = ({ documentId, applicationContext }) => {
  return new Promise((resolve, reject) => {
    applicationContext.getS3().getSignedUrl(
      'getObject',
      {
        Bucket: applicationContext.getDocumentsBucketName(),
        Key: documentId,
        Expires: 120,
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
