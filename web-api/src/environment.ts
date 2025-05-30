const stage = process.env.STAGE || process.env.ENV || 'local';
const region = process.env.AWS_REGION || 'us-east-1';
const isLocal = stage === 'local';
const currentColor = process.env.CURRENT_COLOR || 'green';
const emailFromAddress =
  process.env.EMAIL_SOURCE ||
  `U.S. Tax Court <noreply@${process.env.EFCMS_DOMAIN}>`;
const isRunningOnLambda = !!process.env.LAMBDA_TASK_ROOT;

function getJestDBConnectionError(): string {
  return [
    '\n',
    'Hello Developer',
    'You should not connect to the Database when running JEST tests',
    'Something was not mocked out',
    'If you are running Integration tests and need a Database connection',
    'Set the environment variable "ENV" to "integration"',
  ].join('\n');
}

export const environment = {
  appEndpoint: process.env.EFCMS_DOMAIN
    ? `app-${currentColor}.${process.env.EFCMS_DOMAIN}`
    : 'localhost:1234',
  bouncedEmailRecipient:
    process.env.BOUNCED_EMAIL_RECIPIENT || emailFromAddress,
  cognitoClientId: process.env.COGNITO_CLIENT_ID || 'bvjrggnd3co403c0aahscinne',
  currentColor,
  defaultAccountPass: process.env.DEFAULT_ACCOUNT_PASS || 'Testing1234$',
  documentsBucketName: isLocal
    ? 'noop-documents-local-us-east-1'
    : `${process.env.EFCMS_DOMAIN}-documents-${stage}-us-east-1`,
  dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME || 'efcms-local',
  efcmsDomain: process.env.EFCMS_DOMAIN || 'localhost',
  elasticsearchEndpoint:
    process.env.ELASTICSEARCH_ENDPOINT || 'http://localhost:9200',
  emailFromAddress,
  isRunningOnLambda,
  masterRegion: process.env.MASTER_REGION || 'us-east-1',
  rds: {
    pool: {
      database: process.env.DATABASE_NAME || 'postgres',
      host:
        process.env.POSTGRES_HOST ||
        (process.env.NODE_ENV !== 'test'
          ? 'localhost'
          : getJestDBConnectionError()),
      idleTimeoutMillis: isRunningOnLambda ? 10000 : 1000,
      max: 1,
      password: process.env.POSTGRES_PASSWORD || 'example',
      port: 5432,
      user: process.env.POSTGRES_USER || 'postgres',
    },
    useGlobalCert: !isLocal,
  },
  region,
  s3Endpoint: isLocal
    ? 'http://0.0.0.0:9001'
    : 'https://s3.us-east-1.amazonaws.com',
  stage,
  tempDocumentsBucketName: isLocal
    ? 'noop-temp-documents-local-us-east-1'
    : `${process.env.EFCMS_DOMAIN}-temp-documents-${stage}-us-east-1`,
  userPoolId: process.env.USER_POOL_ID || 'local_2pHzece7',
  userPoolIrsId: process.env.USER_POOL_IRS_ID || 'NOT_REAL_USER_POOL_ID',
  workerQueueUrl: `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/worker_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}`,
  opensearchQueueUrl: `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/opensearch_sync_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}`,

  wsEndpoint: process.env.WS_ENDPOINT || 'http://localhost:3011',
};
