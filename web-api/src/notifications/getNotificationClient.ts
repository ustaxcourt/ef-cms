import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import { NodeHttpHandler } from '@smithy/node-http-handler';

export const getNotificationClient = ({ endpoint }: { endpoint: string }) => {
  if (endpoint && endpoint.includes('localhost')) {
    endpoint = 'http://localhost:3011';
  }
  return new ApiGatewayManagementApiClient({
    endpoint,
    requestHandler: new NodeHttpHandler({
      requestTimeout: 900000, // 15 minutes
    }),
  });
};
