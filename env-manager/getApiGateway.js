const AWS = require('aws-sdk');

exports.getApiGateway = ({ environment }) => {
  const apiGateway = new AWS.ApiGatewayV2({
    accessKeyId: environment.accessKeyId,
    apiVersion: 'latest',
    region: environment.region,
    secretAccessKey: environment.secretAccessKey,
  });

  return apiGateway;
};
