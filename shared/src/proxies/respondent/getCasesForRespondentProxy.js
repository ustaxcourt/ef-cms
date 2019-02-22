/**
 *
 * @param applicationContext
 * @param userId
 * @returns {Promise<*>}
 */
exports.getCasesForRespondent = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  const response = await applicationContext
    .getHttpClient()
    .get(
      `${applicationContext.getBaseUrl()}/respondents/${user.userId}/cases`,
      {
        headers: {
          Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
        },
      },
    );
  return response.data;
};
