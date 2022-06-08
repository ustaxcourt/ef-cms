const { ApiGatewayV2 } = require('aws-sdk');

exports.getApiGateway = ({ environment }) => {
  const apiGateway = new ApiGatewayV2({
    apiVersion: 'latest',
    maxRetries: 20,
    region: environment.region,
  });

  return apiGateway;
};
