import { Agent } from 'https';
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { AsyncZipDeflate, Zip } from 'fflate';
import { PassThrough, Writable } from 'stream';
import { Upload } from '@aws-sdk/lib-storage';

type DocketEntryDownloadInfo = {
  key: string;
  filePathInZip: string;
  useTempBucket: boolean;
};

type DocketEntriesZipperParameter = {
  s3Client: S3;
  documentsReference: string;
  zipName: string;
  connectionId: string;
  wsClient: ApiGatewayManagementApiClient;
};

const {
  AWS_REGION,
  DOCKET_ENTRY_FILES_REFRENCE,
  EFCMS_DOMAIN,
  STAGE,
  WEBSOCKET_API_GATEWAY_ID,
  WEBSOCKET_CONNECTION_ID,
  ZIP_FILE_NAME,
} = process.env as {
  [key: string]: string;
  AWS_REGION: 'us-east-1' | 'us-west-1';
};

const S3_REGION = 'us-east-1';
const TEMP_S3_BUCKET = `${EFCMS_DOMAIN}-temp-documents-${STAGE}-${S3_REGION}`;
const S3_BUCKET = `${EFCMS_DOMAIN}-documents-${STAGE}-${S3_REGION}`;
const storageClient = new S3({
  endpoint: `https://s3.${S3_REGION}.amazonaws.com`,
  forcePathStyle: true,
  maxAttempts: 3,
  region: S3_REGION,
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 3000,
    httpsAgent: new Agent({ keepAlive: true, maxSockets: 75 }),
    requestTimeout: 30000,
  }),
});

const ZIP_TEMP_S3_BUCKET = `${EFCMS_DOMAIN}-temp-documents-${STAGE}-${AWS_REGION}`;
const zipStorageClient = new S3({
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

const WEBSOCKET_ENPOINT = `https://${WEBSOCKET_API_GATEWAY_ID}.execute-api.${AWS_REGION}.amazonaws.com/${STAGE}`;
const notificationClient = new ApiGatewayManagementApiClient({
  endpoint: WEBSOCKET_ENPOINT,
  region: AWS_REGION,
  requestHandler: new NodeHttpHandler({
    requestTimeout: 900000,
  }),
});

//TYPE THIS INSTEAD OF ANY
function streamToBuffer(stream: any) {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

async function getDocketEntriesFromS3(
  documentsReference: string,
  s3Client: S3,
) {
  const fetchDocumentsReferenceCommand = new GetObjectCommand({
    Bucket: TEMP_S3_BUCKET,
    Key: documentsReference,
  });

  const documentsReferenceData = await s3Client.send(
    fetchDocumentsReferenceCommand,
  );

  if (!documentsReferenceData.Body) throw new Error('Unable to get documents');

  const docketEntriesBuffer: any = await streamToBuffer(
    documentsReferenceData.Body,
  );
  const docketEntriesString: string = docketEntriesBuffer.toString('utf-8');
  const docketEntries: DocketEntryDownloadInfo[] =
    JSON.parse(docketEntriesString);
  return docketEntries;
}

export async function zipDocuments({
  connectionId,
  documents,
  outputZipName,
  wsClient,
}: {
  wsClient: any;
  connectionId: string;
  documents: {
    key: string;
    filePathInZip: string;
    useTempBucket: boolean;
  }[];
  outputZipName: string;
}): Promise<void> {
  const passThrough = new PassThrough({ highWaterMark: 1024 * 1024 * 100 });

  const upload = new Upload({
    client: zipStorageClient,
    params: {
      Body: passThrough,
      Bucket: ZIP_TEMP_S3_BUCKET,
      Key: outputZipName,
    },
  });

  const writable = new Writable({
    write(chunk, encoding, callback) {
      callback();
    },
  });

  passThrough.pipe(writable);

  // Start the upload process
  const uploadPromise = upload.done();

  const zip = new Zip((err, data, final) => {
    if (err) {
      console.log('Error creating zip stream');
      throw err;
    }

    passThrough.write(data);

    if (final) {
      passThrough.end();
    }
  });

  for (let index = 0; index < documents.length; index++) {
    const { filePathInZip, key, useTempBucket } = documents[index];
    console.log(`Downloding document (${key})`);

    const response = await storageClient.getObject({
      Bucket: useTempBucket ? TEMP_S3_BUCKET : S3_BUCKET,
      Key: key,
    });

    if (!response.Body) {
      throw new Error(`Unable to get document (${key}) from persistence.`);
    }

    // Transform s3 getobject into a stream of data that can be piped into the zip processor
    const bodyStream: ReadableStream<Uint8Array> =
      response.Body.transformToWebStream();
    const reader = bodyStream.getReader();
    const compressedPdfStream = new AsyncZipDeflate(filePathInZip);
    zip.add(compressedPdfStream);

    let continueReading = true;
    while (continueReading) {
      const unzippedChunk = await reader.read();
      const nextChunk = unzippedChunk.value || new Uint8Array();
      continueReading = !unzippedChunk.done;
      compressedPdfStream.push(nextChunk, unzippedChunk.done);
      while (passThrough.readableLength > 1024 * 1024 * 10) {
        // Wait for the buffer to be drained, before downloading more files
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
    reader.releaseLock();

    console.log(`Download Complete (${key})`);
    const WS_MESSAGE = new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: JSON.stringify({
        action: 'batch_download_progress',
        filesCompleted: index + 1,
        totalFiles: documents.length,
      }),
    });
    await wsClient.send(WS_MESSAGE).catch(console.error);
  }

  zip.end();
  await uploadPromise;
}

export async function app({
  connectionId,
  documentsReference,
  s3Client,
  wsClient,
  zipName,
}: DocketEntriesZipperParameter) {
  console.log('LOADING DOCUMENTS TO DOWNLOAD FROM S3');

  const documents: DocketEntryDownloadInfo[] = await getDocketEntriesFromS3(
    documentsReference,
    s3Client,
  );
  console.log('ZIPPING DOCUMENTS');

  const guid = Date.now();
  const UNIQUE_ZIP_NAME = `${guid}/${zipName}`;

  await zipDocuments({
    connectionId,
    documents,
    outputZipName: UNIQUE_ZIP_NAME,
    wsClient,
  });

  console.log('Fetching Signed URL');
  const command = new GetObjectCommand({
    Bucket: ZIP_TEMP_S3_BUCKET,
    Key: UNIQUE_ZIP_NAME,
  });

  const url = await getSignedUrl(zipStorageClient, command, { expiresIn: 120 });

  console.log('Sending link to user');
  const WS_MESSAGE = new PostToConnectionCommand({
    ConnectionId: connectionId,
    Data: JSON.stringify({
      action: 'batch_download_ready',
      url,
    }),
  });
  await wsClient.send(WS_MESSAGE).catch(console.error);

  console.log('Zip and upload complete, link sent to client.');
}

app({
  connectionId: WEBSOCKET_CONNECTION_ID!,
  documentsReference: DOCKET_ENTRY_FILES_REFRENCE!,
  s3Client: storageClient,
  wsClient: notificationClient,
  zipName: ZIP_FILE_NAME!,
}).catch(console.error);
