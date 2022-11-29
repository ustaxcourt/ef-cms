import { getPdfFromUrl } from './getPdfFromUrl';

const getDownloadPolicy = async ({
  applicationContext,
  docketNumber,
  key,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  key: string;
}) => {
  const {
    data: { url },
  } = await applicationContext
    .getHttpClient()
    .get(
      `${applicationContext.getBaseUrl()}/case-documents/${docketNumber}/${key}/download-policy-url`,
      {
        headers: {
          Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
        },
      },
    );
  return url;
};

export const getDocument = async ({
  applicationContext,
  docketNumber,
  key,
  protocol,
  useTempBucket = false,
}: {
  applicationContext: IApplicationContext;
  docketNumber?: string;
  key: string;
  protocol?: string;
  useTempBucket?: boolean;
}) => {
  if (protocol === 'S3') {
    const S3 = applicationContext.getStorageClient();
    return (
      await S3.getObject({
        Bucket: useTempBucket
          ? applicationContext.getTempDocumentsBucketName()
          : applicationContext.getDocumentsBucketName(),
        Key: key,
      }).promise()
    ).Body;
  } else {
    const url = await getDownloadPolicy({
      applicationContext,
      docketNumber,
      key,
    });

    return await getPdfFromUrl({ applicationContext, url });
  }
};
