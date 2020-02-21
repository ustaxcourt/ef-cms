/* eslint-disable no-console */
const fs = require('fs');
const S3rver = require('s3rver');

console.log('starting s3rver');

new S3rver({
  configureBuckets: [
    {
      configs: [fs.readFileSync('web-api/cors-policy.xml', 'utf-8')],
      name: process.env.DOCUMENTS_BUCKET_NAME,
    },
    {
      configs: [fs.readFileSync('web-api/cors-policy.xml', 'utf-8')],
      name: process.env.TEMP_DOCUMENTS_BUCKET_NAME,
    },
  ],
  directory: 'web-api/storage/s3',
  hostname: 'localhost',
  port: 9000,
  serviceEndpoint: 'localhost',
  silent: false,
}).run(error => {
  console.error(error);
});
