import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import readline from 'readline';
import { getSSMItem } from '../admin-tools/aws/ssmHelper';

const { ENV } = process.env;
const UserPoolCache: Record<string, string> = {};

export const getSourceTableInfo = async (): Promise<{
  tableName: string;
  version: 'alpha' | 'beta';
}> => {
  requireEnvVars(['ENV']);

  const version = (await getSSMItem('source-table-version')) as
    | 'alpha'
    | 'beta';

  if (version) {
    return { tableName: `efcms-${ENV}-${version}`, version };
  } else {
    throw 'Could not determine the current version';
  }
};

export const getDestinationTableInfo = async (): Promise<{
  tableName: string;
  version: 'alpha' | 'beta';
}> => {
  requireEnvVars(['ENV']);

  const version = (await getSSMItem('destination-table-version')) as
    | 'alpha'
    | 'beta';

  if (version) {
    return { tableName: `efcms-${ENV}-${version}`, version };
  } else {
    throw 'Could not determine the current version';
  }
};

export const missingEnvironmentVariables = (
  requiredEnvVars: string[],
): string[] => {
  const envVars = Object.keys(process.env);
  const missing: string[] = [];
  for (const key of requiredEnvVars) {
    if (!envVars.includes(key) || !process.env[key]) {
      missing.push(key);
    }
  }
  return missing;
};

// Exit if any of the provided strings are not set as environment variables
export const requireEnvVars = (requiredEnvVars: string[]): void => {
  const missing = missingEnvironmentVariables(requiredEnvVars);
  if (missing.length > 0) {
    console.error(`Missing environment variable(s): ${missing.join(', ')}`);
    process.exit(1);
  }
};

export const getUserPoolId = async (): Promise<string> => {
  requireEnvVars(['ENV']);

  if (UserPoolCache[ENV!]) {
    return UserPoolCache[ENV!];
  }

  const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
  const { UserPools } = await cognito.listUserPools({
    MaxResults: 50,
  });
  if (UserPools) {
    const userPool = UserPools.find(pool => pool.Name === `efcms-${ENV}`);
    if (userPool && userPool.Id) {
      UserPoolCache[ENV!] = userPool.Id;
      return UserPoolCache[ENV!];
    }
  }

  throw new Error(`No user pool found for name: efcms-${ENV}`);
};

// Ascertain the Client ID for the Cognito User Pool we use to authenticate users
export const getClientId = async (
  userPoolId: string,
): Promise<string | undefined> => {
  const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
  const { UserPoolClients } = await cognito.listUserPoolClients({
    MaxResults: 60,
    UserPoolId: userPoolId,
  });

  if (UserPoolClients) {
    return UserPoolClients[0].ClientId;
  }

  return undefined;
};

export const askQuestion = (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve =>
    rl.question(query, ans => {
      rl.close();
      resolve(ans);
    }),
  );
};
