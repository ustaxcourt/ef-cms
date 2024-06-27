import { ServerApplicationContext } from '@web-api/applicationContext';

export const getPublicDownloadPolicyUrl = ({
  applicationContext,
  key,
}: {
  applicationContext: ServerApplicationContext;
  key: string;
}): Promise<{ url: string }> => {
  return new Promise((resolve, reject) => {
    applicationContext.getStorageClient().getSignedUrl(
      'getObject',
      {
        Bucket: applicationContext.environment.documentsBucketName,
        Expires: 120,
        Key: key,
      },
      (err, data) => {
        if (err) {
          applicationContext.logger.error(
            'unable to create the public download url policy',
            err,
          );
          return reject(err);
        }
        resolve({
          url: applicationContext.getUtilities().documentUrlTranslator({
            applicationContext,
            documentUrl: data,
            useTempBucket: false,
          }),
        });
      },
    );
  });
};
