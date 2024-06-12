import { GetObjectCommand } from '@aws-sdk/client-s3';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const getPublicDownloadPolicyUrl = async ({
  applicationContext,
  key,
}: {
  applicationContext: ServerApplicationContext;
  key: string;
}): Promise<{ url: string }> => {
  const s3 = applicationContext.getStorageClient();

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: key,
    }),
    {
      expiresIn: 120,
    },
  );

  return {
    url: applicationContext.getUtilities().documentUrlTranslator({
      applicationContext,
      documentUrl: url,
      useTempBucket: false,
    }),
  };
};
