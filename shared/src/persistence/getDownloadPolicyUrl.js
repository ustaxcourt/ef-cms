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
 * getDownloadPolicyUrl
 * @param documentId
 * @param applicationContext
 * @returns {Promise<any>}
 */
exports.getDownloadPolicyUrl = ({ documentId, applicationContext }) => {
  return new Promise((resolve, reject) => {
    getS3(applicationContext.environment).getSignedUrl(
      'getObject',
      {
        Bucket: applicationContext.environment.documentsBucketName,
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
