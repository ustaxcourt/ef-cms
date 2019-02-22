/**
 *
 * @param applicationContext
 * @param userId
 * @returns {Promise<*>}
 */
exports.getCasesByUser = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/users/${user.userId}/cases`, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    });
  return response.data;
};
