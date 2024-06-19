import { PassThrough } from 'stream';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { Upload } from '@aws-sdk/lib-storage';
import archiver from 'archiver';

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
  // download all s3 files
  const files = await Promise.all(
    documents.map(async document => {
      const pdf = await applicationContext.getPersistenceGateway().getDocument({
        applicationContext,
        key: document.documentId,
        useTempBucket,
      });
      return { filePathInZip: document.filePathInZip, pdf };
    }),
  );

  const passThrough = new PassThrough();

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

  // combine downloaded files into a zip document
  const zip = archiver('zip');
  zip.on('close', () => {
    console.log('archiving is close');
  });
  zip.on('finish', () => {
    console.log('archiving is finish');
  });
  zip.on('error', err => {
    console.log('archiving ERROR!!!!');
    throw err;
  });

  files.map(file =>
    zip.append(Buffer.from(file.pdf), { name: file.filePathInZip }),
  );
  zip.pipe(passThrough);
  await zip.finalize();

  await upload.done();
}

// Pdfs are not being named correctly
// Progress indicator functionality
