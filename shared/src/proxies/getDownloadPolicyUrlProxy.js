/**
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDownloadPolicyUrl = async ({ documentId, applicationContext }) => {
  const response = await applicationContext
    .getHttpClient()
    .get(
      `${applicationContext.getBaseUrl()}/documents/${documentId}/downloadPolicyUrl`,
      {
        headers: {
          Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
        },
      },
    );
  return response.data;
};
