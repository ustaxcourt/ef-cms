import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

let cognitoClientCache: CognitoIdentityProvider;

export function getCognito() {
  if (!cognitoClientCache) {
    cognitoClientCache = new CognitoIdentityProvider({
      maxAttempts: 3,
      region: 'us-east-1',
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
    });
  }

  return cognitoClientCache;
}
