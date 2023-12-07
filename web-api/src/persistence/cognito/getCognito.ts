import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { cognitoLocalWrapper } from '@web-api/cognitoLocalWrapper';

let cognitoClientCache: CognitoIdentityServiceProvider;

export function getCognito() {
  if (!cognitoClientCache) {
    cognitoClientCache = new CognitoIdentityServiceProvider({
      httpOptions: {
        connectTimeout: 3000,
        timeout: 5000,
      },
      maxRetries: 3,
      region: 'us-east-1',
    });
  }
  return cognitoClientCache;
}

export function getLocalCognito() {
  if (!cognitoClientCache) {
    cognitoClientCache = cognitoLocalWrapper(
      new CognitoIdentityServiceProvider({
        endpoint: 'http://localhost:9229/',
        httpOptions: {
          connectTimeout: 3000,
          timeout: 5000,
        },
        maxRetries: 3,
        region: 'local',
      }),
    );
  }
  return cognitoClientCache;
}
