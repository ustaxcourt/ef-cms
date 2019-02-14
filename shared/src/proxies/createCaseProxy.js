/**
 * createCaseProxy
 *
 * @param documents
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createCase = async ({
  petitionMetadata,
  petitionFileId,
  applicationContext,
}) => {
  const response = await applicationContext.getHttpClient().post(
    `${applicationContext.getBaseUrl()}/cases`,
    {
      petitionFileId,
      petitionMetadata,
    },
    {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    },
  );
  return response.data;
};
