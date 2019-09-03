/* eslint-disable no-console */
const fs = require('fs');
const S3rver = require('s3rver');

console.log('starting s3rver');

new S3rver({
  cors: fs.readFileSync('web-api/cors-policy.xml', 'utf-8'),
  directory: 'web-api/storage/s3',
  hostname: '0.0.0.0',
  port: 9000,
  silent: false,
}).run(error => {
  console.error(error);
});
