import {
  AsyncGzip,
  AsyncUnzipInflate,
  AsyncZipDeflate,
  Unzip,
  Zip,
  gzip,
  strFromU8,
  unzip,
  zip,
  zlib,
} from 'fflate';
import { PassThrough, Writable } from 'stream';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { Upload } from '@aws-sdk/lib-storage';

export async function zipDocuments(
  applicationContext: ServerApplicationContext,
  {
    documents,
    outputZipName,
    useTempBucket,
  }: {
    documents: { documentId: string; filePathInZip: string }[];
    outputZipName: string;
    useTempBucket: boolean;
  },
): Promise<void> {
  const passThrough = new PassThrough({ highWaterMark: 1024 * 1024 * 1 });

  const upload = new Upload({
    client: applicationContext.getStorageClient(),
    params: {
      Body: passThrough,
      Bucket: applicationContext.environment.tempDocumentsBucketName,
      Key: outputZipName,
    },
  });
  upload.on('httpUploadProgress', progress => {
    console.log('s3 upload progress: ', progress);
  });

  const writable = new Writable({
    write(chunk, encoding, callback) {
      console.log('Received chunk:');
      callback();
    },
  });
  passThrough.pipe(writable);

  // Start the upload process
  const uploadPromise = upload.done();

  let count = 1;
  for (let document of documents) {
    const response = await applicationContext.getStorageClient().getObject({
      Bucket: useTempBucket
        ? applicationContext.environment.tempDocumentsBucketName
        : applicationContext.environment.documentsBucketName,
      Key: document.documentId,
    });
    const bigArray = await response.Body?.transformToByteArray()!;

    await new Promise((resolve, reject) => {
      zlib(bigArray, { consume: true, level: 6 }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          passThrough.write(data, () => {
            resolve(true);
          });
        }
      });
    });

    count = count + 1;
    console.log('CompletedDocuments: ', count);
  }
  passThrough.end();

  await uploadPromise;
}

// Pdfs are not being named correctly
// Progress indicator functionality
