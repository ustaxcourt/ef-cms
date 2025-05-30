import { LambdaClient } from '@aws-sdk/client-lambda';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { environment } from '@web-api/environment';
import { Agent } from 'https';

let lambdaClientCache: LambdaClient;
export function getLambdaClient(): LambdaClient {
  if (!lambdaClientCache) {
    lambdaClientCache = new LambdaClient({
      region: environment.region,
      maxAttempts: 0,
      requestHandler: new NodeHttpHandler({
        httpsAgent: new Agent({ keepAlive: true, maxSockets: 75 }),
      }),
    });
  }

  return lambdaClientCache;
}
