/**
 *
 * Save provided file to temp s3 bucket and return file url
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.file the file to save
 * @returns {string} the url to the file
 */
exports.saveFileAndGenerateUrl = async ({
  applicationContext,
  file,
  useTempBucket = false,
}) => {
  const fileId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: file,
    documentId: fileId,
    useTempBucket,
  });

  const {
    url,
  } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    applicationContext,
    documentId: fileId,
    useTempBucket,
  });
  return { fileId, url };
};
