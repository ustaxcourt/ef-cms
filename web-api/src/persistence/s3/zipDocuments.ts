import { AsyncZipDeflate, Gzip, Zip, ZipDeflate } from 'fflate';
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

  let isProcessing = false;
  const writable = new Writable({
    write(chunk, encoding, callback) {
      console.log('Received chunk:');
      isProcessing = false;
      callback();
    },
  });

  passThrough.pipe(writable);

  // Start the upload process
  const uploadPromise = upload.done();

  const zip = new Zip((err, data, final) => {
    console.log('zip data is available');
    passThrough.write(data);

    if (err) {
      console.log('error: ', err);
    }

    if (final) {
      console.log('FINAL');
      passThrough.end();
    }
  });

  let count = 0;
  for (let document of documents) {
    const response = await applicationContext.getStorageClient().getObject({
      Bucket: useTempBucket
        ? applicationContext.environment.tempDocumentsBucketName
        : applicationContext.environment.documentsBucketName,
      Key: document.documentId,
    });
    const bigArray = await response.Body?.transformToByteArray()!;

    const exampleFile = new AsyncZipDeflate(document.filePathInZip, {});
    zip.add(exampleFile);
    exampleFile.push(bigArray, true);
    isProcessing = true;
    while (isProcessing) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    count = count + 1;
    console.log('CompletedDocuments: ', count);
  }

  zip.end();
  // passThrough.end();

  await uploadPromise;
}

// Pdfs are not being named correctly
// Progress indicator functionality
