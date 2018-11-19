const { S3 } = require('aws-sdk');

const getS3 = () => new S3({
  region: process.env.AWS_REGION,
  s3ForcePathStyle: true,
  endpoint: process.env.S3_ENDPOINT,
});

// TODO: use environment to get regions and endpoints, etc
exports.getDownloadUrl = ({ documentId }) =>
  new Promise((resolve, reject) => {
    getS3().getSignedUrl('getObject', {
      Bucket: process.env.DOCUMENTS_BUCKET_NAME,
      Key: documentId,
      Expires: 10
    }, (err, data) => {
      if (err) return reject(err);
      resolve({
        url: data
      });
    });
  });

exports.createUploadPolicy = () =>
  new Promise((resolve, reject) => {
    getS3().createPresignedPost({
      Bucket: process.env.DOCUMENTS_BUCKET_NAME,
      Conditions: [
        ['starts-with', '$key', ''],
        ['starts-with', "$Content-Type", '']
      ],
    }, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
