/**
 * isFileExists
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.key the key to check
 * @returns {Promise} promise of true or false depending on if the file exists or not
 */
export const isFileExists = async ({
  applicationContext,
  key,
  useTempBucket = false,
}: {
  applicationContext: IApplicationContext;
  key: string;
  useTempBucket?: boolean;
}) => {
  try {
    await applicationContext
      .getStorageClient()
      .headObject({
        Bucket: useTempBucket
          ? applicationContext.environment.tempDocumentsBucketName
          : applicationContext.environment.documentsBucketName,
        Key: key,
      })
      .promise();
    return true;
  } catch (headErr) {
    return false;
  }
};
