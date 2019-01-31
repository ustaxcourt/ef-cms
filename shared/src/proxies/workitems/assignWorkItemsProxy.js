/**
 * getWorkItem
 *
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.assignWorkItems = async ({ workItems, applicationContext }) => {
  const userToken = applicationContext.getCurrentUser().userId;
  const response = await applicationContext
    .getHttpClient()
    .put(`${applicationContext.getBaseUrl()}/workitems`, workItems, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  return response.data;
};
