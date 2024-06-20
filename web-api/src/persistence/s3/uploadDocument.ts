import { ServerApplicationContext } from '@web-api/applicationContext';
import { Upload } from '@aws-sdk/lib-storage';

export const uploadDocument = async ({
  applicationContext,
  pdfData,
  pdfName,
  useTempBucket = false,
}: {
  applicationContext: ServerApplicationContext;
  pdfData: any;
  pdfName: string;
  useTempBucket?: boolean;
}): Promise<void> => {
  const bucketName = useTempBucket
    ? applicationContext.environment.tempDocumentsBucketName
    : applicationContext.environment.documentsBucketName;

  try {
    const parallelUploadS3 = new Upload({
      client: applicationContext.getStorageClient(),
      params: {
        Body: pdfData,
        Bucket: bucketName,
        ContentType: 'application/pdf',
        Key: pdfName,
      },
    });

    parallelUploadS3.on('httpUploadProgress', progress => {
      console.log(progress);
    });

    await parallelUploadS3.done();
  } catch (e) {
    console.log(`Failed to upload document (${pdfName}) to S3.`, e);
  }
};