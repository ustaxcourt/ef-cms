import { SQSClient } from '@aws-sdk/client-sqs';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { environment } from '@web-api/environment';

let sqsClient: SQSClient;

export function getSQSMessagingClient() {
  if (!sqsClient) {
    sqsClient = new SQSClient({
      maxAttempts: 3,
      region: environment.region,
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 10000,
        requestTimeout: 5000,
      }),
    });
  }
  return sqsClient;
}
