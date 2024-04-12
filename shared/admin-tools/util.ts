import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import readline from 'readline';

const { ENV } = process.env;
const UserPoolCache: Record<string, string> = {};

export const getSourceTableVersion = async (): Promise<'alpha' | 'beta'> => {
  requireEnvVars(['ENV']);

  const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' });
  const documentClient = DynamoDBDocument.from(dynamodbClient, {
    marshallOptions: { removeUndefinedValues: true },
  });
  const result = await documentClient.get({
    Key: {
      pk: 'source-table-version',
      sk: 'source-table-version',
    },
    TableName: `efcms-deploy-${ENV}`,
  });

  const version = result?.Item?.current;
  if (version) {
    return version;
  } else {
    throw 'Could not determine the current version';
  }
};

export const getDestinationTableName = async (): Promise<string> => {
  requireEnvVars(['ENV']);

  const dynamodbClient = new DynamoDBClient({ region: 'us-east-1' });
  const documentClient = DynamoDBDocument.from(dynamodbClient, {
    marshallOptions: { removeUndefinedValues: true },
  });
  const result = await documentClient.get({
    Key: {
      pk: 'destination-table-version',
      sk: 'destination-table-version',
    },
    TableName: `efcms-deploy-${ENV}`,
  });

  const version = result?.Item?.current;
  if (version) {
    return `efcms-${ENV}-${version}`;
  } else {
    throw 'Could not determine the current version';
  }
};

// Exit if any of the provided strings are not set as environment variables
export const requireEnvVars = (requiredEnvVars: Array<string>): void => {
  const envVars = Object.keys(process.env);
  let missing = '';
  for (const key of requiredEnvVars) {
    if (!envVars.includes(key) || !process.env[key]) {
      missing += `${missing.length > 0 ? ', ' : ''}${key}`;
    }
  }
  if (missing) {
    console.error(`Missing environment variable(s): ${missing}`);
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
