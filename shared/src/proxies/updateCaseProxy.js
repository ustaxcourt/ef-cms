/**
 * updateCase
 *
 * @param applicationContext
 * @param caseToUpdate
 * @param userId
 * @returns {Promise<*>}
 */
exports.updateCase = async ({ applicationContext, caseToUpdate }) => {
  const response = await applicationContext
    .getHttpClient()
    .put(
      `${applicationContext.getBaseUrl()}/cases/${caseToUpdate.caseId}`,
      caseToUpdate,
      {
        headers: {
          Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
        },
      },
    );
  return response.data;
};
