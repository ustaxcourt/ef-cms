/**
 * getWorkItemProxy
 *
 * @param applicationContext
 * @param workItemId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.getWorkItem = async ({ applicationContext, workItemId }) => {
  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/workitems/${workItemId}`, {
      headers: {
        Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
      },
    });
  return response.data;
};
