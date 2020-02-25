/* eslint-disable no-console */
const fs = require('fs');
const S3rver = require('s3rver');

console.log('starting s3rver');

const corsPolicy = fs.readFileSync('web-api/cors-policy.xml');
const webPolicy = fs.readFileSync('web-api/web-policy.xml');

new S3rver({
  configureBuckets: [
    {
      configs: [corsPolicy, webPolicy],
      name: process.env.DOCUMENTS_BUCKET_NAME,
    },
    {
      configs: [corsPolicy, webPolicy],
      name: process.env.TEMP_DOCUMENTS_BUCKET_NAME,
    },
  ],
  directory: 'web-api/storage/s3',
  hostname: 'localhost',
  port: 9000,
  serviceEndpoint: 'localhost',
  silent: false,
}).run((error, props) => {
  if (error) {
    console.error('error', error);
  } else {
    console.info(`S3rver listening on ${props.address}:${props.port}.`);
  }
});
