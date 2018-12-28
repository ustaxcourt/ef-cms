/**
 * getWorkItemProxy
 *
 * @param applicationContext
 * @param workItemId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.getWorkItem = async ({ applicationContext, workItemId, userId }) => {
  const userToken = userId; //TODO refactor for jwt
  const response = await applicationContext
    .getHttpClient()
    .get(`${applicationContext.getBaseUrl()}/workitems/${workItemId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
  return response.data;
};
