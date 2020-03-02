/* eslint-disable no-console */
const fs = require('fs');
const S3rver = require('s3rver');

const corsPolicy = fs.readFileSync('web-api/cors-policy.xml', 'utf-8');

new S3rver({
  configureBuckets: [
    {
      configs: [corsPolicy],
      name: process.env.DOCUMENTS_BUCKET_NAME,
    },
    {
      configs: [corsPolicy],
      name: process.env.TEMP_DOCUMENTS_BUCKET_NAME,
    },
  ],
  directory: 'web-api/storage/s3',
  hostname: '0.0.0.0',
  port: 9000,
  serviceEndpoint: '0.0.0.0',
  silent: false,
}).run(error => {
  console.error(error);
});
