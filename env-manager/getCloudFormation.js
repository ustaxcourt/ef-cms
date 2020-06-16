const { CloudFormation } = require('aws-sdk');

exports.getCloudFormation = ({ environment }) => {
  const cloudFormation = new CloudFormation({
    accessKeyId: environment.accessKeyId,
    apiVersion: 'latest',
    maxRetries: 20,
    region: environment.region,
    secretAccessKey: environment.secretAccessKey,
  });

  return cloudFormation;
};
