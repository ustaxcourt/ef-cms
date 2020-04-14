const AWS = require('aws-sdk');

exports.getCloudFormation = ({ environment }) => {
  const cloudFormation = new AWS.CloudFormation({
    accessKeyId: environment.accessKeyId,
    apiVersion: 'latest',
    region: environment.region,
    secretAccessKey: environment.secretAccessKey,
  });

  return cloudFormation;
};
