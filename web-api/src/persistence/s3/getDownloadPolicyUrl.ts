import { GetObjectCommand } from '@aws-sdk/client-s3';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const getDownloadPolicyUrl = async ({
  applicationContext,
  filename,
  key,
  urlTtl = 120,
  useTempBucket = false,
}: {
  applicationContext: ServerApplicationContext;
  filename?: string;
  key: string;
  urlTtl?: number;
  useTempBucket?: boolean;
}): Promise<{ url: string }> => {
  const bucketName = useTempBucket
    ? applicationContext.environment.tempDocumentsBucketName
    : applicationContext.environment.documentsBucketName;

  const s3Client = applicationContext.getS3Client();

  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
      ResponseContentDisposition: filename
        ? `inline;filename="${filename}"`
        : undefined,
    }),
    {
      expiresIn: urlTtl,
    },
  );

  return {
    url: applicationContext.documentUrlTranslator({
      applicationContext,
      documentUrl: url,
      useTempBucket,
    }),
  };
};
