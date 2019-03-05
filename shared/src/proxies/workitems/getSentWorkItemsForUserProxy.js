/**
 *
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getSentWorkItemsForUser = async ({ userId, applicationContext }) => {
  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/users/${userId}/outbox`, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    });
  return response.data;
};
