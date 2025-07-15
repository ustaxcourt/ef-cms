const getEnvValue = (key: string, defaultValue?: any) => {
  // If window is defined, use Cypress.env; otherwise, use process.env with the CYPRESS prefix.
  if (typeof window === 'object') {
    return Cypress.env(key) || defaultValue;
  }
  return process.env[`CYPRESS_${key}`] || defaultValue;
};

export const getCypressEnv = () => {
  const env = getEnvValue('TARGET_ENV', 'local');

  return {
    accessKeyId: getEnvValue('AWS_ACCESS_KEY_ID', 'S3RVER'),
    cognitoEndpoint: env === 'local' ? 'http://localhost:9229/' : undefined,
    defaultAccountPass: getEnvValue('DEFAULT_ACCOUNT_PASS', 'Testing1234$'),
    deployingColor: getEnvValue('DEPLOYING_COLOR'),
    dynamoDbDeployTableName: getEnvValue(
      'DYNAMODB_DEPLOY_TABLE_NAME',
      'efcms-local',
    ),
    dynamoDbTableName: getEnvValue('DYNAMODB_TABLE_NAME', 'efcms-local'),
    efcmsDomain: getEnvValue('EFCMS_DOMAIN'),
    env,
    publicSiteUrl:
      env === 'local'
        ? 'http://localhost:5678'
        : `https://${getEnvValue('DEPLOYING_COLOR')}.${getEnvValue('EFCMS_DOMAIN')}`,
    rds: {
      pool: {
        database: getEnvValue('DATABASE_NAME', 'postgres'),
        host: getEnvValue('POSTGRES_HOST', 'localhost'),
        idleTimeoutMillis: 1000,
        max: 1,
        password: getEnvValue('POSTGRES_PASSWORD', 'example'),
        port: 5432,
        user: getEnvValue('POSTGRES_USER', 'postgres'),
      },
      // Only use the global cert if a non-default host is set.
      useGlobalCert: getEnvValue('POSTGRES_HOST'),
    },
    region: 'us-east-1',
    secretAccessKey: getEnvValue('AWS_SECRET_ACCESS_KEY', 'S3RVER'),
    sessionToken: getEnvValue('AWS_SESSION_TOKEN', undefined),
  };
};
