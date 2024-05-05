import { MAX_FILE_SIZE_BYTES } from '../../../../shared/src/business/entities/EntityConstants';
import { PresignedPost, createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const getUploadPolicy = async ({
  applicationContext,
  key,
}: {
  applicationContext: ServerApplicationContext;
  key: string;
}): Promise<PresignedPost> => {
  const s3 = applicationContext.getStorageClient();

  return await createPresignedPost(s3, {
    Bucket: applicationContext.environment.documentsBucketName,
    Conditions: [
      ['starts-with', '$key', key],
      ['starts-with', '$Content-Type', ''],
      ['content-length-range', 0, MAX_FILE_SIZE_BYTES],
    ],
    Key: key,
  });
};
