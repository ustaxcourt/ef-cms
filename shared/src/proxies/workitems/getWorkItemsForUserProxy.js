/**
 *
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getWorkItemsForUser = async ({ userId, applicationContext }) => {
  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/users/${userId}/inbox`, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    });

  return response.data;
};
