const awsDynamoPersistence = require('../../business/src/persistence/awsDynamoPersistence');
const docketNumberGenerator = require('../../business/src/persistence/docketNumberGenerator');
const awsS3Persistence = require('../../business/src/persistence/awsS3Persistence');

console.log('S3_ENDPOINT', process.env.S3_ENDPOINT);
console.log('S3_ENDPOINT', process.env.S3_ENDPOINT);
console.log('S3_ENDPOINT', process.env.S3_ENDPOINT);
console.log('S3_ENDPOINT', process.env.S3_ENDPOINT);

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
