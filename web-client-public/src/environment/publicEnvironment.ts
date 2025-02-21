const env = process.env.ENV || 'local';
const efcmsDomain = process.env.EFCMS_DOMAIN;

export const publicEnvironment = {
  dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME,
  efcmsDomain,
  env,
  privateUrl:
    env === 'local' ? 'http://localhost:1234' : `https://app.${efcmsDomain}`,
};
