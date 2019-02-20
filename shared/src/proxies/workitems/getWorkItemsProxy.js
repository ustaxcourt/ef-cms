/**
 *
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getWorkItems = async ({ applicationContext }) => {
  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/workitems`, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    });

  return response.data;
};
