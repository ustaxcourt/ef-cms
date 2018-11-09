const { S3 } = require('aws-sdk');

// TODO: use environment to get regions and endpoints, etc
exports.getDocumentDownloadUrl = ({ documentId }) => {
  const s3 = new S3({
    region: process.env.AWS_REGION,
    s3ForcePathStyle: true,
    endpoint: process.env.S3_ENDPOINT,
  });

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', {
      Bucket: process.env.DOCUMENTS_BUCKET_NAME,
      Key: documentId,
    }, (err, data) => {
      if (err) return reject(err);
      resolve({
        url: data
      });
    });
  });
}

exports.createUploadPolicy = () => {
  const s3 = new S3({
    region: process.env.AWS_REGION,
    s3ForcePathStyle: true,
    endpoint: process.env.S3_ENDPOINT,
  });

  return new Promise((resolve, reject) => {
    s3.createPresignedPost(
      {
        Bucket: process.env.DOCUMENTS_BUCKET_NAME,
        Conditions: [['starts-with', '$key', '']],
      },
      (err, data) => {
        if (err) return reject(err);
        resolve(data);
      },
    );
  });
};