/**
 *
 * @param applicationContext
 * @param caseId
 * @param document
 * @param userId
 * @returns {Promise<*>}
 */
exports.createDocument = async ({ applicationContext, caseId, document }) => {
  const response = await applicationContext
    .getHttpClient()
    .post(
      `${applicationContext.getBaseUrl()}/cases/${caseId}/documents`,
      document,
      {
        headers: {
          Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
        },
      },
    );
  return response.data;
};
