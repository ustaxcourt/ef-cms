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
  const passThrough = new PassThrough({ highWaterMark: 1024 * 1024 * 300 });

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

  for (let document of documents) {
    const pdf = await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      key: document.documentId,
      useTempBucket,
    });
    const compressedPdfStream = new AsyncZipDeflate(document.filePathInZip);
    zip.add(compressedPdfStream);
    compressedPdfStream.push(pdf, true);

    while (passThrough.readableLength > 1024 * 1024 * 50) {
      // Wait for the buffer to be drained, before downloading more files
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  zip.end();
  await uploadPromise;
}

// Progress indicator functionality
