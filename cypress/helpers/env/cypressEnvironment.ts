const stage = process.env.CYPRESS_STAGE || 'local';

export const cypressEnv = {
  accessKeyId: process.env.CYPRESS_AWS_ACCESS_KEY_ID || 'S3RVER',
  cognitoEndpoint: stage === 'local' ? 'http://localhost:9229/' : undefined,
  defaultAccountPass:
    process.env.CYPRESS_DEFAULT_ACCOUNT_PASS || 'Testing1234$',
  dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME || 'efcms-local',
  region: 'us-east-1',
  secretAccessKey: process.env.CYPRESS_AWS_ACCESS_KEY_ID || 'S3RVER',
  stage,
};
