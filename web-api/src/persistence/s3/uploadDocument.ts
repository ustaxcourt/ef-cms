import { ServerApplicationContext } from '@web-api/applicationContext';
import { Upload } from '@aws-sdk/lib-storage';

export const uploadDocument = async ({
  applicationContext,
  pdfData,
  key,
  useTempBucket = false,
}: {
  applicationContext: ServerApplicationContext;
  pdfData: any;
  key: string;
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
        Key: key,
      },
    });

    await parallelUploadS3.done();
  } catch (e) {
    applicationContext.logger.error(
      `Failed to upload document (${key}) to S3.`,
    );
    throw e;
  }
};
