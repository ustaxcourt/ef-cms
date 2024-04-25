import { ApiGatewayV2Client } from '@aws-sdk/client-apigatewayv2';

export const getApiGateway = ({ environment }) => {
  return new ApiGatewayV2Client({
    apiVersion: 'latest',
    maxRetries: 20,
    region: environment.region,
  });
};
