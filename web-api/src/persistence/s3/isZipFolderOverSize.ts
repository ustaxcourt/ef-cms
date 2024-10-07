import { S3 } from '@aws-sdk/client-s3';
import { ServerApplicationContext } from '@web-api/applicationContext';
import PQueue from 'p-queue';

const getDocumentSize = async (
  documentKey: string,
  bucketName: string,
  s3Client: S3,
) => {
  try {
    const headObject = await s3Client.headObject({
      Bucket: bucketName,
      Key: documentKey,
    });

    return headObject.ContentLength!;
  } catch (_error) {
    return 0;
  }
};

export async function isZipFolderOverSize(
  applicationContext: ServerApplicationContext,
  {
    documents,
    sizeInGB,
  }: {
    documents: {
      key: string;
      useTempBucket: boolean;
    }[];
    sizeInGB: number;
  },
): Promise<boolean> {
  let totalSize = 0;
  const BYTES_SIZE = sizeInGB * 1024 * 1024 * 1024;
  const s3Client = applicationContext.getStorageClient();

  const queue = new PQueue({ concurrency: 15 });
  for (const docInformation of documents) {
    const { key, useTempBucket } = docInformation;
    const BUCKET_NAME = useTempBucket
      ? applicationContext.environment.tempDocumentsBucketName
      : applicationContext.environment.documentsBucketName;

    void queue.add(async () => {
      const size = await getDocumentSize(key, BUCKET_NAME, s3Client);
      totalSize += size;

      if (totalSize > BYTES_SIZE) {
        queue.clear();
        return true;
      }
    });

    if (totalSize > BYTES_SIZE) break;
  }

  await queue.onIdle();
  return totalSize >= BYTES_SIZE;
}
