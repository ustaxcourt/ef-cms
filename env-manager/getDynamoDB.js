const { DynamoDB } = require('aws-sdk');

exports.getDynamoDB = ({ environment }) => {
  const dynamoDB = new DynamoDB({
    accessKeyId: environment.accessKeyId,
    apiVersion: 'latest',
    region: environment.region,
    secretAccessKey: environment.secretAccessKey,
  });

  return dynamoDB;
};
