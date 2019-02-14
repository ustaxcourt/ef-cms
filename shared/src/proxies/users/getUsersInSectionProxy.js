/**
 * getCaseProxy
 *
 * @param applicationContext
 * @param caseId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.getUsersInSection = async ({ applicationContext, section }) => {
  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/users?section=${section}`, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    });
  return response.data;
};
