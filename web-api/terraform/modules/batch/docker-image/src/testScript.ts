import { Agent } from 'https';
import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';

const { CURRENT_COLOR, DOCKET_ENTRY_FILES, EFCMS_DOMAIN, STAGE } = process.env;

const DOCKET_ENTRIES = JSON.parse(DOCKET_ENTRY_FILES!);
const AWS_REGION = 'us-east-1';

const storageClient = new S3({
  endpoint: `https://s3.${AWS_REGION}.amazonaws.com`,
  forcePathStyle: true,
  maxAttempts: 3,
  region: AWS_REGION,
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 3000,
    httpsAgent: new Agent({ keepAlive: true, maxSockets: 75 }),
    requestTimeout: 30000,
  }),
});

const WEBSOCKET_ENDPOINT = `websocket_api_${STAGE}_${CURRENT_COLOR}`;

const notificationClient = new ApiGatewayManagementApiClient({
  endpoint: WEBSOCKET_ENDPOINT,
  requestHandler: new NodeHttpHandler({
    requestTimeout: 900000,
  }),
});

type DocketEntriesZipperParameter = {
  s3Client: S3;
  socketClient: ApiGatewayManagementApiClient;
  docketEntries: string[];
};

function streamToBuffer(stream: any) {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

async function downloadFile(
  docketEntry: string,
  s3Client: S3,
  DIRECTORY: string,
) {
  try {
    const command = new GetObjectCommand({
      Bucket: `${EFCMS_DOMAIN}-documents-${STAGE}-${AWS_REGION}`,
      Key: docketEntry,
    });

    const data = await s3Client.send(command);

    if (!data.Body) throw new Error(`Unable to get document (${docketEntry})`);

    const bodyContents: any = await streamToBuffer(data.Body);
    const FILE_PATH = path.join(DIRECTORY, `${docketEntry}.pdf`);
    await writeFile(FILE_PATH, bodyContents);
  } catch (error) {
    console.error(`Error downloading ${docketEntry}:`, error);
  }
}

export async function app({
  docketEntries,
  s3Client,
}: DocketEntriesZipperParameter) {
  const DIRECTORY = path.join(__dirname, 'Docket_Entries/');
  if (!fs.existsSync(DIRECTORY)) fs.mkdirSync(DIRECTORY);

  const BATCH_SIZE = 10;
  for (let i = 0; i < docketEntries.length; i += BATCH_SIZE) {
    const batch = docketEntries.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(docketEntry => downloadFile(docketEntry, s3Client, DIRECTORY)),
    );
  }

  const filesInDir = fs.readdirSync(__dirname);
  console.log('filesInDir', filesInDir);
}

app({
  docketEntries: DOCKET_ENTRIES,
  s3Client: storageClient,
  socketClient: notificationClient,
}).catch(console.error);
