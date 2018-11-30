const awsDynamoPersistence = require('ef-cms-shared/src/persistence/awsDynamoPersistence');
const docketNumberGenerator = require('ef-cms-shared/src/persistence/docketNumberGenerator');
const awsS3Persistence = require('ef-cms-shared/src/persistence/awsS3Persistence');

module.exports = {
  persistence: {
    ...awsDynamoPersistence,
    ...awsS3Persistence,
  },
  docketNumberGenerator,
  environment: {
    stage: process.env.STAGE || 'local',
    region: process.env.AWS_REGION || 'us-east-1',
    s3Endpoint: process.env.S3_ENDPOINT || 'localhost',
    documentsBucketName: process.env.DOCUMENTS_BUCKET_NAME || '',
  },
};
