const { S3 } = require('aws-sdk');

exports.getS3 = ({ environment }) => {
  const s3 = new S3({
    apiVersion: 'latest',
    region: environment.region,
  });

  return s3;
};
