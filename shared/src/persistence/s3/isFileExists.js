/**
 * isFileExists
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentId the documentId to check
 * @returns {Promise} promise of true or false depending on if the file exists or not
 */
exports.isFileExists = async ({ applicationContext, documentId }) => {
  try {
    await applicationContext
      .getStorageClient()
      .headObject({
        Bucket: applicationContext.getDocumentsBucketName(),
        Key: documentId,
      })
      .promise();
    return true;
  } catch (headErr) {
    return false;
  }
};
