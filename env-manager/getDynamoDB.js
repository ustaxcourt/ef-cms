const { DynamoDB } = require('aws-sdk');

exports.getCloudFormation = ({ environment }) => {
  const dynamoDB = new DynamoDB({
    accessKeyId: environment.accessKeyId,
    apiVersion: 'latest',
    region: environment.region,
    secretAccessKey: environment.secretAccessKey,
  });

  return dynamoDB;
};
