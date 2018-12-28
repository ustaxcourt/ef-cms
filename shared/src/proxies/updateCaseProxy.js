/**
 * updateCase
 *
 * @param applicationContext
 * @param caseToUpdate
 * @param userId
 * @returns {Promise<*>}
 */
exports.updateCase = async ({ applicationContext, caseToUpdate, userId }) => {
  const userToken = userId; // TODO: refactor for jwt
  const response = await applicationContext
    .getHttpClient()
    .put(
      `${applicationContext.getBaseUrl()}/cases/${caseToUpdate.caseId}`,
      caseToUpdate,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
  return response.data;
};
