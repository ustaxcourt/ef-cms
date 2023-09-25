/**
 *
 * Save provided file to temp s3 bucket and return file url
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.file the file to save
 * @returns {string} the url to the file
 */
export const saveFileAndGenerateUrl = async ({
  applicationContext,
  file,
  URLTTL,
  useTempBucket = false,
}: {
  applicationContext: IApplicationContext;
  file: Blob;
  useTempBucket?: boolean;
  URLTTL?: number;
}) => {
  const fileId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: file,
    key: fileId,
    useTempBucket,
  });

  const { url } = await applicationContext
    .getPersistenceGateway()
    .getDownloadPolicyUrl({
      URLTTL,
      applicationContext,
      key: fileId,
      useTempBucket,
    });
  return { fileId, url };
};
