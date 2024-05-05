import { ServerApplicationContext } from '@web-api/applicationContext';
import { Upload } from '@aws-sdk/lib-storage';

export const uploadToS3 = async ({
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
    const parallelUploads3 = new Upload({
      client: applicationContext.getStorageClient(),
      params: {
        Body: pdfData,
        Bucket: bucketName,
        ContentType: 'application/pdf',
        Key: pdfName,
      },
    });

    parallelUploads3.on('httpUploadProgress', progress => {
      console.log(progress);
    });

    await parallelUploads3.done();
  } catch (e) {
    console.log(e);
  }
};
