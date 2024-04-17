/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.key the key of the document to get
 * @returns {Promise<any>} the promise of the call to the storage client
 */
export const getPublicDownloadPolicyUrl = ({
  applicationContext,
  key,
}: {
  applicationContext: IApplicationContext;
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
          url: applicationContext.documentUrlTranslator({
            applicationContext,
            documentUrl: data,
            useTempBucket: false,
          }),
        });
      },
    );
  });
};
