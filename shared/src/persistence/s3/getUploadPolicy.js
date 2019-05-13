exports.MAX_FILE_SIZE_MB = 500; // megabytes
exports.MAX_FILE_SIZE_BYTES = exports.MAX_FILE_SIZE_MB * 1024 * 1024; // bytes -> megabytes

/**
 * getUploadPolicy
 * @param applicationContext
 * @returns {Promise<any>}
 */
exports.getUploadPolicy = ({ applicationContext }) =>
  new Promise((resolve, reject) => {
    applicationContext.getStorageClient().createPresignedPost(
      {
        Bucket: applicationContext.getDocumentsBucketName(),
        Conditions: [
          ['starts-with', '$key', ''],
          ['starts-with', '$Content-Type', ''],
          ['content-length-range', 0, exports.MAX_FILE_SIZE_BYTES],
        ],
      },
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      },
    );
  });
