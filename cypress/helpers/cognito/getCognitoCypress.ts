import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { getCypressEnv } from '../env/cypressEnvironment';

let cognitoCache: CognitoIdentityProvider;
export const getCognito = (): CognitoIdentityProvider => {
  if (!cognitoCache) {
    cognitoCache = new CognitoIdentityProvider({
      credentials: {
        accessKeyId: getCypressEnv().accessKeyId,
        secretAccessKey: getCypressEnv().secretAccessKey,
        sessionToken: getCypressEnv().sessionToken,
      },
      endpoint: getCypressEnv().cognitoEndpoint,
      region: getCypressEnv().region,
    });
  }

  return cognitoCache;
};
