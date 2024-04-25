import { ApiGatewayV2Client } from '@aws-sdk/client-apigatewayv2';

export type tApiGatewayEnvironment = {
  apiVersion?: string;
  name?: string;
  region?: string;
};

export const getApiGateway = ({
  environment,
}: {
  environment: tApiGatewayEnvironment;
}): ApiGatewayV2Client => {
  return new ApiGatewayV2Client({
    apiVersion: environment.apiVersion || 'latest',
    maxAttempts: 20,
    region: environment.region,
  });
};
