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
  // KNOWN BUGS:
  // - users is a FORCE_CHANGE_PASSWORD state will get a new password challenge when authenticating even if the wrong password is entered
  // - respondToAuthChallenge does not associate tokens returned in authenticationResult on the user; cannot refresh app _immediately_ after changing password

  if (!cognitoClientCache) {
    cognitoClientCache = new CognitoIdentityProvider({
      endpoint: 'http://localhost:9229/',
      maxAttempts: 3,
      region: 'local',
    });
  }

  return cognitoClientCache;
}
