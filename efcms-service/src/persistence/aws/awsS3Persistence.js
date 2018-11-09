const { S3 } = require('aws-sdk');

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