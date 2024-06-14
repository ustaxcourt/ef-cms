import { ServerApplicationContext } from '@web-api/applicationContext';
import { pinkLog } from '@shared/tools/pinkLog';

export const saveFileAndGenerateUrl = async ({
  applicationContext,
  contentType = 'application/pdf',
  file,
  fileNamePrefix,
  urlTtl,
  useTempBucket = false,
}: {
  applicationContext: ServerApplicationContext;
  file: Buffer;
  fileNamePrefix?: string;
  contentType?: string;
  useTempBucket?: boolean;
  urlTtl?: number; // time to live of link in seconds
}): Promise<{
  fileId: string;
  url: string;
}> => {
  const fileId = applicationContext.getUniqueId();

  const fileName = fileNamePrefix ? `${fileNamePrefix}${fileId}` : fileId;

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    contentType,
    document: file,
    key: fileName,
    useTempBucket,
  });

  pinkLog('saveFileAndGenerateUrl 1');

  const { url } = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      applicationContext,
      key: fileName,
      urlTtl,
      useTempBucket,
    });
  pinkLog('saveFileAndGenerateUrl 2 url', url);

  return { fileId, url };
};
