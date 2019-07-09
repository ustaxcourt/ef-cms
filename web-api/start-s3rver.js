const fs = require('fs');
const S3rver = require('s3rver');

console.log('starting s3rver');

new S3rver({
  cors: fs.readFileSync('./cors-policy.xml', 'utf-8'),
  directory: './storage/s3',
  hostname: '0.0.0.0',
  port: 9000,
  silent: false,
  // errorDocument,
  // indexDocument,
}).run();