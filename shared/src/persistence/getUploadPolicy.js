/**
 * getUploadPolicy
 * @param applicationContext
 * @returns {Promise<any>}
 */
exports.getUploadPolicy = ({ applicationContext }) =>
  new Promise((resolve, reject) => {
    applicationContext.getS3().createPresignedPost(
      {
        Bucket: applicationContext.getDocumentsBucketName(),
        Conditions: [
          ['starts-with', '$key', ''],
          ['starts-with', '$Content-Type', ''],
        ],
      },
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      },
    );
  });
