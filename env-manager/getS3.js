const { S3 } = require('aws-sdk');

exports.getS3 = ({ environment }) => {
  const s3 = new S3({
    accessKeyId: environment.accessKeyId,
    apiVersion: 'latest',
    credentials: environment.credentials,
    region: environment.region,
    secretAccessKey: environment.secretAccessKey,
  });

  return s3;
};
