export const getCypressEnv = () => {
  if (typeof window === 'object') {
    const env = Cypress.env('TARGET_ENV') || 'local';
    return {
      accessKeyId: Cypress.env('AWS_ACCESS_KEY_ID') || 'S3RVER',
      cognitoEndpoint: env === 'local' ? 'http://localhost:9229/' : undefined,
      defaultAccountPass: Cypress.env('DEFAULT_ACCOUNT_PASS') || 'Testing1234$',
      dynamoDbTableName: Cypress.env('DYNAMODB_TABLE_NAME') || 'efcms-local',
      env,
      publicSiteUrl:
        env === 'local'
          ? 'http://localhost:5678'
          : `https://${Cypress.env('DEPLOYING_COLOR')}.${Cypress.env('EFCMS_DOMAIN')}`,
      region: 'us-east-1',
      secretAccessKey: Cypress.env('AWS_SECRET_ACCESS_KEY') || 'S3RVER',
      sessionToken: Cypress.env('AWS_SESSION_TOKEN') || undefined,
    };
  }

  const env = process.env.CYPRESS_TARGET_ENV || 'local';
  return {
    accessKeyId: process.env.CYPRESS_AWS_ACCESS_KEY_ID || 'S3RVER',
    cognitoEndpoint: env === 'local' ? 'http://localhost:9229/' : undefined,
    defaultAccountPass:
      process.env.CYPRESS_DEFAULT_ACCOUNT_PASS || 'Testing1234$',
    dynamoDbTableName: process.env.CYPRESS_DYNAMODB_TABLE_NAME || 'efcms-local',
    env,
    publicSiteUrl:
      env === 'local'
        ? 'http://localhost:5678'
        : `https://${process.env.CYPRESS_DEPLOYING_COLOR}.${process.env.CYPRESS_EFCMS_DOMAIN}`,
    region: 'us-east-1',
    secretAccessKey: process.env.CYPRESS_AWS_SECRET_ACCESS_KEY || 'S3RVER',
    sessionToken: process.env.CYPRESS_AWS_SESSION_TOKEN || undefined,
  };
};
