/**
 * getDownloadPolicyURL
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDownloadPolicyUrl = async ({ documentId, applicationContext }) => {
  const response = await applicationContext
    .getHttpClient()
    .get(
      `${applicationContext.getBaseUrl()}/documents/${documentId}/downloadPolicyUrl`,
    );
  return response.data;
};
