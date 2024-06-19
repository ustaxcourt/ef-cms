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

  const zip = archiver('zip');
  zip.on('error', err => {
    console.log(
      `Error while creating zip file: ${outputZipName}. Zipping files:${documents.map(doc => ` ${doc.documentId}`)}`,
    );
    throw err;
  });
  zip.pipe(passThrough);

  await Promise.all(
    documents.map(async document => {
      const pdf = await applicationContext.getPersistenceGateway().getDocument({
        applicationContext,
        key: document.documentId,
        useTempBucket,
      });

      zip.append(Buffer.from(pdf), { name: document.filePathInZip });
    }),
  );

  await zip.finalize();
  await upload.done();
}

// Pdfs are not being named correctly
// Progress indicator functionality
