const { S3 } = require('aws-sdk');

const getS3 = ({ region, s3Endpoint }) => {
  return new S3({
    region,
    s3ForcePathStyle: true,
    endpoint: s3Endpoint,
  });
};

exports.getDownloadPolicyUrl = ({ documentId, applicationContext }) =>
  new Promise((resolve, reject) => {
    getS3(applicationContext.environment).getSignedUrl(
      'getObject',
      {
        Bucket: applicationContext.environment.documentsBucketName,
        Key: documentId,
        Expires: 10,
      },
      (err, data) => {
        if (err) return reject(err);
        resolve({
          url: data,
        });
      },
    );
  });

exports.createUploadPolicy = ({ applicationContext }) =>
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
