const { S3 } = require('aws-sdk');



exports.createUploadPolicy = () => {

  const s3 = new S3({
    region: 'us-east-1',
    s3ForcePathStyle: true,
    endpoint: process.env.S3_ENDPOINT
  });

  return new Promise((resolve, reject) => {
    s3.createPresignedPost({
      Bucket: process.env.DOCUMENTS_BUCKET_NAME,
      Conditions: [
        ['starts-with', '$key', ''],
      ],
    }, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}