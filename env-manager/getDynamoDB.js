const { DynamoDB } = require('aws-sdk');

exports.getDynamoDB = ({ environment }) => {
  const dynamoDB = new DynamoDB({
    accessKeyId: environment.accessKeyId,
    apiVersion: 'latest',
    credentials: environment.credentials,
    region: environment.region,
    secretAccessKey: environment.secretAccessKey,
  });

  return dynamoDB;
};
