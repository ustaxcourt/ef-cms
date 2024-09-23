import { Agent } from 'https';
import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';
import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import { writeFile } from 'fs/promises';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

type DocketEntryDownloadInfo = {
  key: string;
  filePathInZip: string;
};

type DocketEntriesZipperParameter = {
  s3Client: S3;
  socketClient: ApiGatewayManagementApiClient;
  docketEntries: DocketEntryDownloadInfo[];
  zipName: string;
};

const {
  CURRENT_COLOR,
  DOCKET_ENTRY_FILES,
  EFCMS_DOMAIN,
  STAGE,
  ZIP_FILE_NAME,
} = process.env;

const DOCKET_ENTRIES: DocketEntryDownloadInfo[] = JSON.parse(
  DOCKET_ENTRY_FILES!,
);
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
const TEMP_S3_BUCKET = `${EFCMS_DOMAIN}-temp-documents-${STAGE}-${AWS_REGION}`;
const S3_BUCKET = `${EFCMS_DOMAIN}-documents-${STAGE}-${AWS_REGION}`;

const notificationClient = new ApiGatewayManagementApiClient({
  endpoint: WEBSOCKET_ENDPOINT,
  requestHandler: new NodeHttpHandler({
    requestTimeout: 900000,
  }),
});

function streamToBuffer(stream: any) {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

async function downloadFile(
  docketEntry: DocketEntryDownloadInfo,
  s3Client: S3,
  DIRECTORY: string,
) {
  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: docketEntry.key,
    });

    const data = await s3Client.send(command);

    if (!data.Body)
      throw new Error(`Unable to get document (${docketEntry.key})`);

    const bodyContents: any = await streamToBuffer(data.Body);
    const FILE_PATH = path.join(DIRECTORY, `${docketEntry.filePathInZip}`);
    fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
    await writeFile(FILE_PATH, bodyContents);
  } catch (error) {
    console.error(`Error downloading ${docketEntry}:`, error);
  }
}

function zipFolder(
  sourceFolderPath: string,
  outZipPath: string,
): Promise<void> {
  const output = fs.createWriteStream(outZipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve());
    archive.on('error', (err: Error) => reject(err));
    archive.pipe(output);
    archive.directory(sourceFolderPath, false);
    void archive.finalize();
  });
}

async function uploadZipFile(s3Client: S3, filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  const fileName = path.basename(filePath);

  const uploadParams = {
    Body: fileStream,
    Bucket: TEMP_S3_BUCKET,
    ContentType: 'application/zip',
    Key: fileName,
  };

  try {
    return await s3Client.send(new PutObjectCommand(uploadParams));
  } catch (err) {
    console.error('Error uploading file:', err);
  }
}

export async function app({
  docketEntries,
  s3Client,
  zipName,
}: DocketEntriesZipperParameter) {
  const DIRECTORY = path.join(__dirname, `${Date.now()}/`);
  if (!fs.existsSync(DIRECTORY)) fs.mkdirSync(DIRECTORY);

  const BATCH_SIZE = 10;
  for (let i = 0; i < docketEntries.length; i += BATCH_SIZE) {
    const batch = docketEntries.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(docketEntry => downloadFile(docketEntry, s3Client, DIRECTORY)),
    );
  }

  const ZIP_PATH = path.join(__dirname, zipName);
  await zipFolder(DIRECTORY, ZIP_PATH);

  const results = await uploadZipFile(s3Client, ZIP_PATH);
  console.log('results', results);
}

app({
  docketEntries: DOCKET_ENTRIES,
  s3Client: storageClient,
  socketClient: notificationClient,
  zipName: ZIP_FILE_NAME!,
}).catch(console.error);
