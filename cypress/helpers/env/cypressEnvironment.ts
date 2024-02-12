const env = process.env.ENV || 'local';

export const cypressEnv = {
  accessKeyId: process.env.CYPRESS_AWS_ACCESS_KEY_ID || 'S3RVER',
  cognitoEndpoint: env === 'local' ? 'http://localhost:9229/' : undefined,
  defaultAccountPass:
    process.env.CYPRESS_DEFAULT_ACCOUNT_PASS || 'Testing1234$',
  dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME || 'efcms-local',
  env,
  region: 'us-east-1',
  secretAccessKey: process.env.CYPRESS_AWS_SECRET_ACCESS_KEY || 'S3RVER',
  sessionToken: process.env.CYPRESS_AWS_SESSION_TOKEN || undefined,
};
