const { S3 } = require('aws-sdk');

/**
 * getS3
 * @param region
 * @param s3Endpoint
 * @returns {S3}
 */
const getS3 = ({ region, s3Endpoint }) => {
  return new S3({
    region,
    s3ForcePathStyle: true,
    endpoint: s3Endpoint,
  });
};
/**
 * getUploadPolicy
 * @param applicationContext
 * @returns {Promise<any>}
 */
exports.getUploadPolicy = ({ applicationContext }) =>
  new Promise((resolve, reject) => {
    getS3(applicationContext.environment).createPresignedPost(
      {
        Bucket: applicationContext.environment.documentsBucketName,
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
