import { environment } from '@web-api/environment';
import { getStorageClient } from '@web-api/persistence/s3/getStorageClient';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { WithImplicitCoercion } from 'buffer';

export const saveDocumentFromLambda = async ({
  contentType: ContentType = 'application/pdf',
  document: body,
  key,
  useTempBucket = false,
}: {
  contentType?: string;
  document: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>;
  key: string;
  useTempBucket?: boolean;
}): Promise<void> => {
  let Bucket = environment.documentsBucketName;
  if (useTempBucket) {
    Bucket = environment.tempDocumentsBucketName;
  }

  const maxRetries = 1;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      await getStorageClient().putObject({
        Body: Buffer.from(body),
        Bucket,
        ContentType,
        Key: key,
      });
      break;
    } catch (err) {
      if (i >= maxRetries) {
        getDawsonLogger().error(
          'An error occurred while attempting to save the document',
          { error: err },
        );
        throw err;
      }
    }
  }
};
