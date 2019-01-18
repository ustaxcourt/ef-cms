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
  const userToken = applicationContext.getCurrentUser().userId; // TODO temp until jwt
  const response = await applicationContext.getHttpClient().post(
    `${applicationContext.getBaseUrl()}/cases`,
    {
      petitionFileId,
      petitionMetadata,
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
