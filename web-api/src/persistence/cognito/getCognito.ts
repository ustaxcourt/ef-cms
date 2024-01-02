import { Agent } from 'https';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { NodeHttpHandler } from '@smithy/node-http-handler';

let cognitoClientCache: CognitoIdentityProvider;

export function getCognito() {
  if (!cognitoClientCache) {
    cognitoClientCache = new CognitoIdentityProvider({
      maxAttempts: 3,
      region: 'us-east-1',
      requestHandler: new NodeHttpHandler({
        connectionTimeout: 3000,
        httpsAgent: new Agent({ keepAlive: true, maxSockets: 75 }),
        requestTimeout: 5000,
      }),
    });
  }

  return cognitoClientCache;
}

export function getLocalCognito() {
  if (!cognitoClientCache) {
    cognitoClientCache = new CognitoIdentityProvider({
      endpoint: 'http://localhost:9229/',
      maxAttempts: 3,
      region: 'local',
      // requestHandler: new NodeHttpHandler({
      //   connectionTimeout: 3000,
      //   httpsAgent: new Agent({ keepAlive: true, maxSockets: 75 }),
      //   requestTimeout: 5000,
      // }),
    });
  }

  return cognitoClientCache;
}
