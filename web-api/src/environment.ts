export const environment = {
  appEndpoint: process.env.EFCMS_DOMAIN
    ? `app.${process.env.EFCMS_DOMAIN}`
    : 'localhost:1234',
  cognitoClientId: process.env.COGNITO_CLIENT_ID || 'bvjrggnd3co403c0aahscinne',
  currentColor: process.env.CURRENT_COLOR || 'green',
  defaultAccountPass: process.env.DEFAULT_ACCOUNT_PASS || 'Testing1234$',
  documentsBucketName: process.env.DOCUMENTS_BUCKET_NAME || '',
  dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME || 'efcms-local',
  elasticsearchEndpoint:
    process.env.ELASTICSEARCH_ENDPOINT || 'http://localhost:9200',
  emailFromAddress:
    process.env.EMAIL_SOURCE ||
    `U.S. Tax Court <noreply@${process.env.EFCMS_DOMAIN}>`,
  masterRegion: process.env.MASTER_REGION || 'us-east-1',
  quarantineBucketName: process.env.QUARANTINE_BUCKET_NAME || '',
  region: process.env.AWS_REGION || 'us-east-1',
  s3Endpoint: process.env.S3_ENDPOINT || 'localhost',
  stage: process.env.STAGE || 'local',
  tempDocumentsBucketName: process.env.TEMP_DOCUMENTS_BUCKET_NAME || '',
  userPoolId: process.env.USER_POOL_ID || 'local_2pHzece7',
  virusScanQueueUrl: process.env.VIRUS_SCAN_QUEUE_URL || '',
  workerQueueUrl:
    `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/worker_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}` ||
    '',
  wsEndpoint: process.env.WS_ENDPOINT || 'http://localhost:3011',
};
