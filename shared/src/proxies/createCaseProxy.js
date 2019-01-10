/**
 * createCaseProxy
 *
 * @param documents
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createCase = async ({ petition, documents, applicationContext }) => {
  const userToken = applicationContext.getCurrentUser().userId; // TODO temp until jwt
  const response = await applicationContext.getHttpClient().post(
    `${applicationContext.getBaseUrl()}/cases`,
    {
      documents,
      petition,
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );
  return response.data;
};
