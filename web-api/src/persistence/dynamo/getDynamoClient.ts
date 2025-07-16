import { Agent } from 'https';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import AWSXRay from 'aws-xray-sdk';
import { environment } from '@web-api/environment';

let dynamoCache: DynamoDBClient | null = null;

export const getDynamoClient = (): DynamoDBClient => {
  if (!dynamoCache) {
    const dynamoClient = new DynamoDBClient({
      endpoint:
        environment.stage === 'local' ? 'http://localhost:8000' : undefined,
      maxAttempts: 5,
      region: environment.region,
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 3000,
        httpsAgent: new Agent({ keepAlive: true, maxSockets: 75 }),
        requestTimeout: 5000,
      }),
    });

    dynamoCache = environment.isRunningOnLambda
      ? AWSXRay.captureAWSv3Client(dynamoClient)
      : dynamoClient;
  }
  return dynamoCache;
};
