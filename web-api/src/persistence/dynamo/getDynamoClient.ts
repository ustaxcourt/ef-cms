import { Agent } from 'https';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import AWSXRay from 'aws-xray-sdk';

let dynamoCache: Record<string, DynamoDBClient> = {};

export const getDynamoClient = (
  applicationContext: IApplicationContext,
  {
    useMainRegion = false,
  }: {
    useMainRegion: boolean;
  },
): DynamoDBClient => {
  const type = useMainRegion ? 'master' : 'region';

  if (!dynamoCache[type]) {
    const dynamoClient = new DynamoDBClient({
      endpoint:
        applicationContext.environment.stage === 'local'
          ? 'http://localhost:8000'
          : undefined,
      maxAttempts: 5,
      region: useMainRegion
        ? applicationContext.environment.masterRegion
        : applicationContext.environment.region,
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 3000,
        httpsAgent: new Agent({ keepAlive: true, maxSockets: 75 }),
        requestTimeout: 5000,
      }),
    });
    dynamoCache[type] =
      applicationContext.environment.stage === 'local'
        ? dynamoClient
        : AWSXRay.captureAWSv3Client(dynamoClient);
  }
  return dynamoCache[type];
};
