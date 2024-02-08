import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { cypressEnv } from '../env/cypressEnvironment';

let cognitoCache: CognitoIdentityProvider;
export const getCognito = (): CognitoIdentityProvider => {
  if (!cognitoCache) {
    cognitoCache = new CognitoIdentityProvider({
      credentials: {
        accessKeyId: cypressEnv.accessKeyId,
        secretAccessKey: cypressEnv.secretAccessKey,
        sessionToken: cypressEnv.sessionToken,
      },
      endpoint: cypressEnv.cognitoEndpoint,
      region: cypressEnv.region,
    });
  }

  return cognitoCache;
};
