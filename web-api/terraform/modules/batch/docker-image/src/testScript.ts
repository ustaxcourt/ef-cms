import { Agent } from 'https';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { S3 } from '@aws-sdk/client-s3';

const { clientId, EFCMS_DOMAIN, files, stage } = process.env;

console.log('EFCMS_DOMAIN', EFCMS_DOMAIN);
console.log('typeof EFCMS_DOMAIN', typeof EFCMS_DOMAIN);
console.log('clientId', clientId);
console.log('typeof clientId', typeof clientId);
console.log('stage', stage);
console.log('typeof stage', typeof stage);

const s3Client = new S3({
  endpoint: 'https://s3.us-east-1.amazonaws.com',
  forcePathStyle: true,
  maxAttempts: 3,
  region: 'us-east-1',
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 3000,
    httpsAgent: new Agent({ keepAlive: true, maxSockets: 75 }),
    requestTimeout: 30000,
  }),
});

async function app() {
  const fileNames = JSON.parse(files!);
  const data = await s3Client.getObject({
    Bucket: `${EFCMS_DOMAIN}-documents-${stage}-us-east-1`,
    Key: fileNames[0],
  });

  console.log('data', data);
}

app().catch(console.error);
