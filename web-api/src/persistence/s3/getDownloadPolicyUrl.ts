import { ServerApplicationContext } from '@web-api/applicationContext';

export const getDownloadPolicyUrl = ({
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

  return new Promise((resolve, reject) => {
    applicationContext.getStorageClient().getSignedUrl(
      'getObject',
      {
        Bucket: bucketName,
        Expires: urlTtl,
        Key: key,
        ResponseContentDisposition: filename
          ? `inline;filename="${filename}"`
          : undefined,
      },
      (err, data) => {
        if (err) {
          applicationContext.logger.error(
            'could not create a download policy url',
            err,
          );
          return reject(new Error(err));
        }
        resolve({
          url: applicationContext.getUtilities().documentUrlTranslator({
            applicationContext,
            documentUrl: data,
            useTempBucket,
          }),
        });
      },
    );
  });
};
