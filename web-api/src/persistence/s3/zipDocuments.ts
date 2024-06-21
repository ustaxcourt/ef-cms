import { AsyncZipDeflate, Zip } from 'fflate';
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
  const passThrough = new PassThrough({ highWaterMark: 1024 * 1024 * 512 });

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

  const zip = new Zip((err, data, final) => {
    if (err) {
      console.log('Error creating zip stream');
      throw err;
    }

    console.log('zip data is available');
    const idk = passThrough.write(data);
    if (!idk) {
      console.log('UH OH WE ARE OVERFLOWING');
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

    const exampleFile = new AsyncZipDeflate(document.filePathInZip);
    zip.add(exampleFile);
    exampleFile.push(bigArray, true);
    while (passThrough.readableLength > 1024 * 1024 * 256) {
      console.log('Draining: ', passThrough.readableLength);
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    count = count + 1;
    console.log('CompletedDocuments: ', count);
  }

  zip.end();

  await uploadPromise;
}

// Progress indicator functionality
