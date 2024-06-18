import { GetObjectCommand } from '@aws-sdk/client-s3';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { environment } from '@web-api/environment';
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
    ? environment.tempDocumentsBucketName
    : environment.documentsBucketName;

  const ResponseContentDisposition = filename
    ? `inline;filename="${filename}"`
    : undefined;

  const client = applicationContext.getStorageClient();
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
    ResponseContentDisposition,
  });
  const url = await getSignedUrl(client, command, { expiresIn: urlTtl });

  return { url };
};
